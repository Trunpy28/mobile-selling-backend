import { Router } from "express";
import productController from "../controllers/product.controller.js";

const ProductRouter = Router();

ProductRouter.post('/create', productController.createProduct);
ProductRouter.get('/:slug', productController.getProductBySlug);
ProductRouter.get('/id/:id', productController.getProductById);
ProductRouter.get('/', productController.getAllProducts);
ProductRouter.put('/update/:id', productController.updateProduct);
ProductRouter.delete('/delete/:id', productController.deleteProduct);

export default ProductRouter;