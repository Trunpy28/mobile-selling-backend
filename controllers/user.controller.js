import userService from '../services/user.service.js';
import tokenService from '../services/token.service.js';
import cloudinaryServices from '../services/cloudinary.service.js';
import { get } from 'mongoose';

const userController = {
    register: async (req, res) => {
        try {
            const { email, password, passwordConfirm } = req.body;

            if (password !== passwordConfirm) {
                return res.status(400).json({
                    success: false,
                    message: 'Mật khẩu không khớp'
                });
            }
            const newUser = await userService.register(email, password);

            res.status(201).json({
                message: "Đăng ký tài khoản thành công"
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },
    signIn: async (req, res) => {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({
                message: 'Chưa có thông tin email'
            });
        }

        try {
            const user = await userService.signIn(email, password);

            const accessToken = tokenService.generateAccessToken(user);
            const refreshToken = tokenService.generateRefreshToken(user);

            // Gửi refresh token qua cookie HttpOnly
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS trong môi trường sản xuất
                sameSite: 'None',
            });

            return res.status(200).json({
                message: "Đăng nhập thành công",
                accessToken
            })
        }
        catch (error) {
            return res.status(400).json({
                message: error.message
            }
            )
        }
    },
    getUserInfomations: async (req, res) => {
        const userId = req?.user?._id;
        if (!userId) return res.status(404).json({
            message: 'User id không tồn tại'
        })

        try {
            const user = await userService.getUserInformations(userId);
            return res.status(200).json({
                user,
                message: 'Lấy thông tin người dùng thành công'
            });
        }
        catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    },
    signOut: async (req, res) => {
        try {
            // Xóa cookie refresh token
            res.clearCookie('refresh_token');

            res.status(200).json({ message: 'Đăng xuất thành công' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    changeAvatar: async (req, res) => {
        const userId = req?.user?._id;
        if (!userId) return res.status(404).json({
            message: 'User id không tồn tại'
        })

        const avatarFile = req.file;
        if (!avatarFile) return res.status(404).json({
            message: 'Chưa có file ảnh avatar'
        })

        try {
            const avatarUrl = await cloudinaryServices.uploadFile(avatarFile);
            await userService.updateAvatar(userId, avatarUrl);

            return res.status(200).json({
                message: 'Thay đổi ảnh đại diện thành công',
                avatarUrl: avatarUrl
            })
        }
        catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    },
    updateProfile: async (req, res) => {
        const userId = req?.user?._id;
        if (!userId) return res.status(404).json({
            message: "Tài khoản không tồn tại"
        })

        try {
            const updatedUser = await userService.updateProfile(userId, req.body);

            return res.status(200).json({
                message: "Cập nhật thông tin thành công",
                user: updatedUser
            })
        }
        catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    },
    refreshAccessToken: async (req, res) => {
        try {
            const refreshToken = req.cookies.refresh_token; // Lấy refresh token từ cookie
            const newAccessToken = await userService.refreshAccessToken(refreshToken);
            res.status(200).json(newAccessToken);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const { users, countUser } = await userService.getAllUsers();
            res.status(200).json({
                message: 'Lấy danh sách người dùng thành công',
                data: users,
                countUser: countUser
            });
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    },

    getUserById: async (req, res) => {
        const { userId } = req.params;
        if (!userId) return res.status(404).json({
            message: 'User id không tồn tại'
        })

        try {
            const user = await userService.getUserById(userId);
            return res.status(200).json({
                message: 'Lấy thông tin người dùng thành công',
                data: user
            });
        }
        catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    },

    deleteUser: async (req, res) => {
        const { userId } = req.params;
        if (!userId) return res.status(404).json({
            message: 'User id không tồn tại'
        })

        try {
            await userService.deleteUser(userId);
            return res.status(200).json({
                message: 'Xóa người dùng thành công'
            });
        }
        catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    },

    countTotalUsers: async (req, res) => {
        try {
            const totalUsers = await userService.countTotalUsers();
            return res.status(200).json({
                success: true,
                totalUsers: totalUsers
            });
        }
        catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }
}

export default userController;