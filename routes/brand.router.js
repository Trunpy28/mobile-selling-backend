import { Router } from "express";
import brandController from "../controllers/brand.controller.js";

const BrandRouter = Router();

BrandRouter.get('/', brandController.getAllBrands);
BrandRouter.post('/', brandController.createBrand);
BrandRouter.put('/:id', brandController.updateBrand);
BrandRouter.delete('/:id', brandController.deleteBrand);

export default BrandRouter;