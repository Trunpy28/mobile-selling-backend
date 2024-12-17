import { Router } from "express";
import brandController from "../controllers/brand.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const BrandRouter = Router();

BrandRouter.get('/get-all', brandController.getAllBrands);
BrandRouter.get('/brand-by-name/:name', brandController.getBrandByName);
BrandRouter.get('/brands-with-count', brandController.getBrandsWithProductCount);
BrandRouter.post('/create', authMiddleware, upload.single('logoUrl'), brandController.createBrand);
BrandRouter.get('/details/:id', brandController.getBrandById);
BrandRouter.put('/update/:id', authMiddleware, upload.single('logoUrl'), brandController.updateBrand);
BrandRouter.delete('/delete/:id', authMiddleware, brandController.deleteBrand);

export default BrandRouter;