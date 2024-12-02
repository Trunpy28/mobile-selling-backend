import { Router } from "express";
import productDetailController from "../controllers/productDetail.controller.js";

const ProductDetailRouter = Router();

ProductDetailRouter.post('/create', productDetailController.createProductDetail);
ProductDetailRouter.get('/', productDetailController.getProductDetail);
ProductDetailRouter.put('/update/:productId', productDetailController.updateProductDetail);
ProductDetailRouter.delete('/delete/:productId', productDetailController.deleteProductDetail);

export default ProductDetailRouter;