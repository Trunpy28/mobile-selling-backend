import paymentService from '../services/payment.service.js';

const paymentController = {
    createPaymentByMoMo: async (req, res) => {
        const { amount, orderInfo, orderId, requestId, paymentCode } = req.body;
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const momoPayment = await paymentService.createPaymentByMoMo(
                { amount, orderInfo, orderId, requestId, paymentCode },
                session
            );

            await session.commitTransaction();
            await session.endSession();

            return res.status(200).json({
                message: "Thanh toán MoMo thành công",
                data: momoPayment
            });
        } catch (error) {
            await session.abortTransaction();
            await session.endSession();
            return res.status(500).json({
                message: 'Thanh toán thất bại',
                error: error.message
            });
        }
    }
}

export default paymentController;
