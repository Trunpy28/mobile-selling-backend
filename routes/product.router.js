import { Router } from "express";
import productController from "../controllers/product.controller.js";

const ProductRouter = Router();

ProductRouter.get('/', productController.getAllProducts);
ProductRouter.post('/create', productController.createProduct);
ProductRouter.get('/product-details/:id', productController.getProductById);
ProductRouter.get('/details/:slug', productController.getProductBySlug);
ProductRouter.get('/get-all', productController.getAllProducts);
ProductRouter.put('/update/:id', productController.updateProduct);
ProductRouter.delete('/delete/:id', productController.deleteProduct);
ProductRouter.get('/products-of-brand', productController.getProductsOfBrand);

export default ProductRouter;