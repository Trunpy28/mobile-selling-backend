import mongoose from 'mongoose';
import Order from '../models/order.model.js'
import cartService from './cart.service.js';
import paymentService from './payment.service.js';
import axios from 'axios';
import crypto from 'crypto';

const orderService = {
    createOrder: async (userId, shippingInfo, paymentMethod) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const cart = await cartService.getMyCart(userId);
            if (!cart || cart.products.length === 0) {
                return res.status(400).json({
                    message: 'Giỏ hàng trống'
                })

            }

            const products = cart.products.map(item => {
                return {
                    product: item.product._id,
                    quantity: item.quantity,
                    price: item.product.price
                }
            })

            console.log(shippingInfo);

            const newOrder = new Order({
                userId,
                products,
                shippingInfo
            });

            await newOrder.save({ session });
            let newPayment;
            if (paymentMethod === 'MoMo') {
                newPayment = await paymentService.createPayment(newOrder?._id, {
                    paymentMethod,
                    amountPaid: newOrder.totalPrice,
                }, session);
                const paymentUrl = await initiateMoMoPayment(newOrder);
                console.log("Payment URL from MoMo:", paymentUrl);
                return { newOrder, newPayment, paymentUrl };
            } else {
                newPayment = await paymentService.createPayment(newOrder?._id, {
                    paymentMethod,
                    amountPaid: newOrder.totalPrice,
                }, session);
            }

            await cartService.clearCart(userId, session);

            await session.commitTransaction();
            await session.endSession();

            await newOrder.populate('products.product', 'id name price imageUrl color')
            return {
                newOrder,
                newPayment
            };
        }
        catch (error) {
            await session.abortTransaction();
            await session.endSession();
            throw error;
        }
    }
}

async function initiateMoMoPayment(order) {
    const accessKey = 'F8BBA842ECF85';
    const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const orderInfo = 'Pay with MoMo';
    const partnerCode = 'MOMO';
    const redirectUrl = 'http://localhost:5173/order-success';
    const ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    const requestType = "payWithMethod";
    const amount = order.totalPrice;  // Sử dụng tổng giá trị đơn hàng
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const extraData = '';
    const autoCapture = true;
    const lang = 'vi';

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = {
        partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        lang,
        requestType,
        autoCapture,
        extraData,
        signature
    };

    try {
        console.log('MoMo Request Body:', requestBody);

        const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('MoMo Response:', response.data);

        if (response.data.resultCode === 0) {
            return response.data.payUrl;
        } else {
            throw new Error(`MoMo API Error: ${response.data.message} (resultCode: ${response.data.resultCode})`);
        }
    } catch (error) {
        console.error('MoMo Payment Error:', error.message);
        throw new Error('Failed to initiate MoMo payment: ' + error.message);
    }
}



export default orderService;