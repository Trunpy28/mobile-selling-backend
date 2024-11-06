import userService from '../services/user.service.js';

const userController = {
    register: async (req, res) => {
        try {
            const { email, password, passwordConfirm } = req.body;

            if (password !== passwordConfirm) {
                return res.status(400).json({
                    success: false,
                    message: 'Passwords do not match'
                });
            }
            const newUser = await userService.register({
                email,
                password
            });

            res.status(201).json({
                success: true,
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