import { Router } from "express";
import userController from "../controllers/user.controller.js";

const UserRouter = Router();

UserRouter.post('/register', userController.register);

export default UserRouter;