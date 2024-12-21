import vnpay from '../config/vnpayConfig.js';
import Payment from '../models/payment.model.js'

const paymentService = {
    createPayment: async (orderId, data, session, ipAddr) => {
        let { paymentMethod, amountPaid, transactionId, paymentStatus, orderInfo } = data;
        let paidAt = null;

        if (paymentStatus === "Completed") {
            paidAt = new Date();
        }

        const newPayment = new Payment({
            orderId,
            paymentMethod,
            amountPaid,
            transactionId,
            paymentStatus,
            paidAt
        });

        const savedPayment = await newPayment.save({ session: session });

        if (paymentMethod === "VNPay") {
            const amount = amountPaid * 100;
            const paymentParams = {
                amount,
                orderId: orderId.toString(),
                orderInfo,
                ipAddr: ipAddr,
                returnUrl: `${process.env.CLIENT_URL}/order-success`,
                locale: "vn",
                currency: "VND"
            }

            try {
                const paymentUrl = await vnpay.buildPaymentUrl(paymentParams);
                return { paymentUrl, savedPayment };
            } catch (error) {
                console.error('Error creating VNPay payment:', error);
                throw new Error(error.message);

            }
        }
        return { savedPayment };
    },


    //Xy ly phan hoi tu VNPay sau khi thanh toan
    handleVNPayReturn: async (query) => {
        try {
            const isValid = vnpay.validateReturnUrl(query);
            if (!isValid) {
                throw new Error('Invalid payment signature');
            }
            const { vnp_Amount, vnp_OrderInfo, vnp_TransactionNo, vnp_ResponseCode } = query;
            const paymentStatus = vnp_ResponseCode === '00' ? 'Completed' : 'Pending';
            const amountPaid = vnp_Amount / 100;

            const updatedPayment = await Payment.findOneAndUpdate(
                { orderId: vnp_OrderInfo },
                {
                    transactionId: vnp_TransactionNo,
                    paymentStatus,
                    amountPaid,
                    paidAt: paymentStatus === 'Completed' ? new Date() : null,
                },
                { new: true }
            );
            return updatedPayment;
        } catch (error) {
            console.error('Error handling VNPay return:', error);
            throw new Error(error.message);
        }
    }
}

export default paymentService;