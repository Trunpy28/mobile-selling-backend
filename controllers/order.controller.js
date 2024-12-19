import orderService from "../services/order.service.js";

const orderController = {
    createOrder: async (req, res) => {
        const userId = req.user.id;

        const { shippingInfo, paymentMethod } = req.body;

        if(!userId) {
            return res.status(401).json({
                message: 'Tài khoản không tồn tại'
            })
        }
        try {
            const newData = await orderService.createOrder(userId, shippingInfo, paymentMethod);

            return res.status(200).json({
                message: "Tạo đơn hàng thành công",
                ...newData
            })
        }
        catch(error) {
            return res.status(500).json({
                message: 'Tạo đơn hàng thất bại'
            })
        }
    }
}

export default orderController;