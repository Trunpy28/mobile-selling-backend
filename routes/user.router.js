import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const UserRouter = Router();

UserRouter.get('/get-all', userController.getAllUsers);
UserRouter.get('/get-by-id/:userId', userController.getUserById);
UserRouter.post('/register', userController.register);
UserRouter.post('/sign-in', userController.signIn);
UserRouter.post('/sign-out', userController.signOut);
UserRouter.get('/user-infomation', authMiddleware, userController.getUserInfomations);
UserRouter.patch('/change-avatar', authMiddleware, upload.single("avatarImage"), userController.changeAvatar);
UserRouter.put('/update-profile', authMiddleware, userController.updateProfile);
UserRouter.post('/refresh-access-token', userController.refreshAccessToken);
UserRouter.delete('/delete/:userId', userController.deleteUser);

export default UserRouter;