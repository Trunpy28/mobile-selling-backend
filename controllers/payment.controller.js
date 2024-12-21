import paymentService from '../services/payment.service.js';

const paymentController = {
    createPayment: async (req, res) => {
        const { orderId, data } = req.body;
        const ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.ip;
        try {
            const { paymentUrl, savedPayment } = await paymentService.createPayment(orderId, data, req.session, ipAddr);

            return res.status(200).json({
                paymentUrl,
                savedPayment
            });
        } catch (error) {
            console.error('Error creating payment:', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Xử lý phản hồi từ VNPay sau khi thanh toán
    handleVNPayReturn: async (req, res) => {
        const query = req.query; // Lấy các tham số từ query string của VNPay

        try {
            // Xử lý phản hồi từ VNPay
            const updatedPayment = await paymentService.handleVNPayReturn(query);

            // Trả về thông tin thanh toán đã cập nhật
            return res.status(200).json({
                success: true,
                payment: updatedPayment
            });
        } catch (error) {
            console.error('Error handling VNPay return:', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

export default paymentController;
