import orderService from "../services/order.service.js";

const orderController = {
    createOrder: async (req, res) => {
        const userId = req.user.id;
        const { shippingInfo, paymentMethod } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: 'Tài khoản không tồn tại'
            });
        }

        try {
            const newData = await orderService.createOrder(userId, shippingInfo, paymentMethod);

            if (paymentMethod === 'MoMo') {
                return res.status(200).json({
                    message: "Tạo đơn hàng thành công, chuyển hướng tới thanh toán MoMo",
                    paymentUrl: newData.paymentUrl,
                    ...newData
                });
            }

            return res.status(200).json({
                message: "Tạo đơn hàng thành công",
                ...newData
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Tạo đơn hàng thất bại',
                error: error.message
            });
        }
    },

    countOrders: async (req, res) => {
        try {
            const count = await orderService.countOrders();
            return res.status(200).json({
                count
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Lấy số lượng đơn hàng thất bại',
                error: error.message
            });
        }
    }
}

export default orderController;
