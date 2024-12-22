import mongoose from 'mongoose';
import Order from '../models/order.model.js'
import cartService from './cart.service.js';
import paymentService from './payment.service.js';
import Payment from '../models/payment.model.js';
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
                    paymentStatus: "Completed",
                    amountPaid: newOrder.totalPrice,
                }, session);
                const paymentUrl = await initiateMoMoPayment(newOrder);
                console.log("Payment URL from MoMo:", paymentUrl);
                await cartService.clearCart(userId, session);

                await session.commitTransaction();
                await session.endSession();

                await newOrder.populate('products.product', 'id name price imageUrl color')
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

            await newOrder.populate('products.product', 'id name price imageUrl color');
            
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
    },

    countOrders: async () => {
        try {
            return await Order.countDocuments();
        } catch (error) {
            throw new Error('Failed to count orders: ' + error.message);
        }
    },  
    getAllOrders: async () => {
        try {
            const payments = await Payment.find().select('orderId paymentMethod paymentStatus');
            const orders = await Order.find().select("userId shippingInfo.name totalPrice shippingStatus createdAt").populate("userId", "email");
    
            const paymentsMap = payments.reduce((map, payment) => {
                map[payment.orderId] = payment;
                return map;
            }, {});
            
            const ordersInfo = orders.map(order => ({
                order,
                payment: paymentsMap[order._id]
            }));
    

            return ordersInfo;
        } catch (error) {
            console.error("Error in getAllOrders:", error);
            throw new Error("Lấy thông tin các đơn hàng thất bại");
        }
    },
    getDetailsOrder: async (orderId) => {
        if(!mongoose.Types.ObjectId.isValid(orderId)){
            throw new Error("OrderId không hợp lệ");
        }

        try {
            const order = await Order.findById(orderId).populate("products.product", "id name price imageUrl color");
            const payment = await Payment.findOne({ orderId });

            if(!order) {
                throw new Error("Đơn hàng không tồn tại");
            }
            if(!payment) {
                throw new Error("Thanh toán của đơn hàng không tồn tại")
            }

            return {
                order,
                payment
            }
        }
        catch(error) {
            console.error("Error in getDetailsOrder:", error);
            throw new Error("Lấy thông tin đơn hàng thất bại");
        }
    },
    changeOrderStatus: async (orderId, data) => {
        const { shippingStatus, paymentStatus } = data;
        
        if(!mongoose.Types.ObjectId.isValid(orderId)) {
            throw new Error("Orderid không hợp lệ");
        }

        if(!["Pending", "Shipping", "Completed"].includes(shippingStatus)) {
            throw new Error("Trạng thái vận chuyển đơn hàng không hợp lệ");
        }

        if(!["Pending", "Completed"].includes(paymentStatus)) {
            throw new Error("Trạng thái thanh toán đơn hàng không hợp lệ")
        }

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await Order.findByIdAndUpdate(orderId, { shippingStatus }, { session });

            const payment = await Payment.findOne({ orderId });
            payment.paymentStatus = paymentStatus;

            await payment.save({ session });

            await session.commitTransaction();
            await session.endSession();
        }
        catch(error) {
            await session.abortTransaction();
            await session.endSession();
            throw new Error("Cập nhật thông tin đơn hàng thất bại")
        }
    },
    deleteOrder: async(orderId) => {
        if(!mongoose.Types.ObjectId.isValid(orderId)) {
            throw new Error("OrderId không hợp lệ")
        }

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await Payment.deleteOne({ orderId }, { session });

            await Order.findByIdAndDelete(orderId, { session });

            await session.commitTransaction();
            await session.endSession();
        }
        catch(error) {
            await session.abortTransaction();
            await session.endSession();
            throw new Error("Xóa đơn hàng thất bại");
        }
    }
}

async function initiateMoMoPayment(order) {
    const accessKey = process.env.ACCESS_KEY_MOMO;
    const secretKey = process.env.SECRET_KEY_MOMO;
    const partnerCode = process.env.PARTNER_CODE_MOMO;
    const redirectUrl = process.env.REDIRECT_URL_MOMO;
    const ipnUrl = process.env.IPN_URL_MOMO;
    const orderInfo = 'Pay with MoMo';
    const requestType = "payWithMethod";
    const amount = order.totalPrice;
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