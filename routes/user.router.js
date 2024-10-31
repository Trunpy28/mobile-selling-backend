import { Router } from "express";
import userController from "../controllers/user.controller.js";

const UserRouter = Router();

UserRouter.post('/signup', userController.signup);

export default UserRouter;