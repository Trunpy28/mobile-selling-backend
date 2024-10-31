import userService from '../services/user.service.js';

const userController = {
    signup: async (req, res) => {
        try {
            const { email, password, passwordConfirm } = req.body;
            const { newUser, accessToken } = await userService.signup({ email, password, passwordConfirm });

            res.status(201).json({
                success: true,
                accessToken,
                data: {
                    user: newUser
                }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default userController;