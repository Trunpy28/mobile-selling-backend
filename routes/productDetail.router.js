import { Router } from "express";
import productDetailController from "../controllers/productDetail.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const ProductDetailRouter = Router();

ProductDetailRouter.post('/create', authMiddleware, productDetailController.createProductDetail);
ProductDetailRouter.get('/', productDetailController.getProductDetail);
ProductDetailRouter.put('/update/:productId', authMiddleware, productDetailController.updateProductDetail);
ProductDetailRouter.delete('/delete/:productId', authMiddleware, productDetailController.deleteProductDetail);

export default ProductDetailRouter;