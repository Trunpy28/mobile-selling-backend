import { Router } from "express";
import productDetailController from "../controllers/productDetail.controller.js";
import { adminAuthMiddleware, authMiddleware } from "../middlewares/auth.middleware.js";

const ProductDetailRouter = Router();

ProductDetailRouter.post('/create', authMiddleware, adminAuthMiddleware, productDetailController.createProductDetail);
ProductDetailRouter.get('/:productId', productDetailController.getProductDetail);
ProductDetailRouter.patch('/update/:productId', authMiddleware, adminAuthMiddleware,productDetailController.updateProductDetail);
ProductDetailRouter.delete('/delete/:productId', authMiddleware, adminAuthMiddleware,productDetailController.deleteProductDetail);

export default ProductDetailRouter;