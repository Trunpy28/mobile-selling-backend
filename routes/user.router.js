import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const UserRouter = Router();

UserRouter.post('/register', userController.register);
UserRouter.post('/sign-in', userController.signIn);
UserRouter.get('/user-infomation', authMiddleware, userController.getUserInfomations);

export default UserRouter;