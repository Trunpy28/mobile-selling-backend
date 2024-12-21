import orderService from "../services/order.service.js";

const orderController = {
    createOrder: async (req, res) => {
        const userId = req.user.id;
        const ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.ip;
        const { shippingInfo, paymentMethod } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: 'Tài khoản không tồn tại'
            })
        }
        try {
            const { newOrder, paymentData } = await orderService.createOrder(userId, shippingInfo, paymentMethod, ipAddr);

            return res.status(200).json({
                message: "Tạo đơn hàng thành công",
                newOrder,
                paymentData
            })
        }
        catch (error) {
            return res.status(500).json({
                message: 'Tạo đơn hàng thất bại',
                error: error.message,
            })
        }
    }
}

export default orderController;