import { Router } from "express";
import productController from "../controllers/product.controller.js";

const ProductRouter = Router();

ProductRouter.get('/', productController.getAllProducts);
ProductRouter.post('/create', productController.createProduct);
ProductRouter.get('/product-details/:id', productController.getProductById);
ProductRouter.get('/:slug', productController.getProductBySlug);
ProductRouter.put('/update/:id', productController.updateProduct);
ProductRouter.delete('/delete/:id', productController.deleteProduct);

export default ProductRouter;