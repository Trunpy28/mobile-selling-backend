import mongoose from 'mongoose';
import Order from '../models/order.model.js'
import cartService from './cart.service.js';
import paymentService from './payment.service.js';
import Payment from '../models/payment.model.js';

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
            });
            
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
    },
    getMyOrders: async (userId) => {
        if(!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("UserId không hợp lệ");
        }

        try {
            const orders = await Order.find({ userId }).populate("products.product", "id name imageUrl color")
                                    .sort({ createdAt: -1 });

            return orders;
        }
        catch(error) {
            throw new Error("Lấy thông tin các đơn hàng thất bại");
        }
    },
}

export default orderService;