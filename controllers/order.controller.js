import { sendCreateOrderEmail } from "../services/email.service.js";
import orderService from "../services/order.service.js";

const orderController = {
    createOrder: async (req, res) => {
        const userId = req.user.id;
        const email = req.user.email;
        const { shippingInfo, paymentMethod } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: 'Tài khoản không tồn tại'
            });
        }
        try {
            const newData = await orderService.createOrder(userId, shippingInfo, paymentMethod);
            try {
                await sendCreateOrderEmail(newData.newOrder, email);
            }
            catch(error) {
                console.log(error);
            }
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
    },
    getAllOrders: async (req,res) => {
        try {
            const data = await orderService.getAllOrders();

            return res.status(200).json({
                message: 'Lấy thông tin các đơn hàng thành công',
                data
            })
        }
        catch(error) {
            return res.status(500).json({
                message: 'Lấy thông tin các đơn hàng thất bại'
            })
        }
    },
    getOrderDetails: async (req, res) => {
        const userId = req.user.id;
        const orderId = req.params.orderId;

        if(!userId) {
            return res.status(401).json({
                message: 'Tài khoản không tồn tại'
            })
        }

        if(!orderId) {
            return res.status(400).json({
                message: "Id của đơn hàng không tồn tại"
            })
        }

        try {
            const data = await orderService.getOrderDetails(userId, orderId);

            if(!data) {
                return res.status(404).json({
                    message: "Thông tin đơn hàng không tồn tại"
                })
            }

            return res.status(200).json({
                message: "Lấy thông tin đơn hàng thành công",
                ...data
            })
        }
        catch(error) {
            return res.status(500).json({
                message: error.message
            })
        }
    },
    changeOrderStatus: async (req, res) => {
        const orderId = req.params.orderId;

        if(!orderId) {
            return res.status(400).json({
                message: "Id của đơn hàng không tồn tại"
            })
        }
        
        try {
            await orderService.changeOrderStatus(orderId, req.body);

            return res.status(200).json({
                message: "Cập nhật trạng thái đơn hàng thành công"
            })
        }
        catch(error) {
            return res.status(500).json({
                message: error.message
            })
        }
    },
    deleteOrder: async (req, res) => {
        const orderId = req.params.orderId;
        if(!orderId) {
            return res.status(400).json({
                message: "Id của đơn hàng không tồn tại"
            })
        }

        try {
            await orderService.deleteOrder(orderId);

            return res.status(200).json({
                message: "Xóa đơn hàng thành công"
            })
        }
        catch(error) {
            return res.status(500).json({
                message: error.message
            })
        }
    },
    getMyOrders: async (req, res) => {
        const userId = req.user.id;
        if(!userId) {
            return res.status(401).json({
                message: 'Tài khoản không tồn tại'
            })
        }

        try {
            const orders = await orderService.getMyOrders(userId);

            return res.status(200).json({
                message: "Lấy thông tin đơn hàng của tôi thành công",
                orders
            })
        }
        catch(error) {
            return res.status(500).json({
                message: error.message
            })
        }
    },
}

export default orderController;
