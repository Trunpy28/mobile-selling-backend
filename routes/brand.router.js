import { Router } from "express";
import brandController from "../controllers/brand.controller.js";

const BrandRouter = Router();

BrandRouter.get('/', brandController.getAllBrands);
BrandRouter.post('/create', brandController.createBrand);
BrandRouter.get('/:id', brandController.getBrandById);
BrandRouter.put('/update/:id', brandController.updateBrand);
BrandRouter.delete('/delete/:id', brandController.deleteBrand);

export default BrandRouter;