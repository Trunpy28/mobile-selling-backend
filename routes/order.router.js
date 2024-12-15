import { Router } from "express";
import orderController from "../controllers/order.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const OrderRouter = Router();

OrderRouter.post('/create', authMiddleware, orderController.createOrder);

export default OrderRouter;