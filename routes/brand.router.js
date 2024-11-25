import { Router } from "express";
import brandController from "../controllers/brand.controller.js";

const BrandRouter = Router();

BrandRouter.get('/get-all', brandController.getAllBrands);
BrandRouter.post('/create', brandController.createBrand);
BrandRouter.get('/details/:id', brandController.getBrandById);
BrandRouter.put('/update/:id', brandController.updateBrand);
BrandRouter.delete('/delete/:id', brandController.deleteBrand);

export default BrandRouter;