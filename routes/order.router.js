import { Router } from "express";
import orderController from "../controllers/order.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const OrderRouter = Router();

OrderRouter.post('/create', authMiddleware, orderController.createOrder);
OrderRouter.get('/count', authMiddleware, orderController.countOrders);

export default OrderRouter;