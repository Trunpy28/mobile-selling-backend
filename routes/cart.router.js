import { Router } from 'express';
import cartController from '../controllers/cart.controller.js';
import { authMiddleware } from "../middlewares/auth.middleware.js";

const CartRouter = Router();

CartRouter.get('/my-cart', authMiddleware, cartController.getMyCart);
CartRouter.patch('/update-product', authMiddleware, cartController.updateProduct);
CartRouter.patch('/add-product', authMiddleware, cartController.addProductToCart);

export default CartRouter;