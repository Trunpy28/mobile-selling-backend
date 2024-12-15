import mongoose from 'mongoose';
import Order from '../models/order.model.js'
import cartService from './cart.service.js';
import paymentService from './payment.service.js';

const orderService = {
    createOrder: async (userId, shippingInfo, paymentMethod) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const cart = await cartService.getMyCart(userId);
                if(!cart || cart.products.length === 0) {
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

            const newPayment = await paymentService.createPayment(newOrder?._id, {
                paymentMethod,
                amountPaid: newOrder.totalPrice, 
            }, session);

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

export default orderService;