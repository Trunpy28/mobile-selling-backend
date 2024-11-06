import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

const userService = {
    register: async (email, password) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            throw new Error('Email already exists');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                email,
                password: hashedPassword
            });
            return newUser;
        } catch (error) {
            throw new Error(error.message);
        }

    },
    signIn: async (email, password) => {
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return new Error('Email hoặc mật khẩu không đúng');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return new Error('Email hoặc mật khẩu không đúng' );
        }

        return {
            _id: user?._id,
            email: user?.email,
            role: user?.role
        }
    }
}

export default userService;