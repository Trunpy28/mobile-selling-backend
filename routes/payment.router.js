import { Router } from 'express';
import paymentController from '../controllers/payment.controller.js';

const PaymentRouter = Router();

PaymentRouter.get('/vnpay-return', paymentController.handleVNPayReturn);
PaymentRouter.post('/create-vnpay-url', paymentController.createPayment);

export default PaymentRouter;