import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const createToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

const userService = {
    signup: async (userData) => {
        const newUser = await User.create(userData);
        const accessToken = createToken(newUser._id);
        return { newUser, accessToken };
    },
}

export default userService;