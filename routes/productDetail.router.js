import { Router } from "express";
import productDetailController from "../controllers/productDetail.controller.js";

const ProductDetailRouter = Router();

ProductDetailRouter.post('/create', productDetailController.createProductDetail);
ProductDetailRouter.get('/', productDetailController.getProductDetail);

export default ProductDetailRouter;