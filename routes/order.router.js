import { Router } from "express";
import orderController from "../controllers/order.controller.js";
import { adminAuthMiddleware, authMiddleware } from "../middlewares/auth.middleware.js";

const OrderRouter = Router();

OrderRouter.post('/create', authMiddleware, orderController.createOrder);
OrderRouter.get('/get-all', authMiddleware, adminAuthMiddleware, orderController.getAllOrders);
OrderRouter.patch('/change-status/:orderId', authMiddleware, adminAuthMiddleware, orderController.changeOrderStatus);
OrderRouter.delete('/delete/:orderId', authMiddleware, adminAuthMiddleware, orderController.deleteOrder);

export default OrderRouter;