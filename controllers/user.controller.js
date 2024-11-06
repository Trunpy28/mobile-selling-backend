import userService from '../services/user.service.js';
import tokenService from '../services/token.service.js';

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
        if(!email) {
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
                sameSite: 'Strict',
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
        )}
    }
}

export default userController;