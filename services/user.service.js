import mongoose from 'mongoose';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import tokenService from '../services/token.service.js';

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
            throw new Error('Email hoặc mật khẩu không đúng');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Email hoặc mật khẩu không đúng' );
        }

        return {
            _id: user?._id,
            email: user?.email,
            role: user?.role
        }
    },
    getUserInformations: async (userId) => {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("UserId không hợp lệ");
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new Error('Tài khoản không tồn tại');
        }

        return {
            email: user.email,
            password: user.password,
            name: user.name,
            phoneNumber: user.phoneNumber,
            address: user.address,
            avatarUrl: user.avatarUrl,
            role: user.role
        }
    },
    updateAvatar: async (userId, avatarUrl) => {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("UserId không hợp lệ");
        }

        try {
            const user = await User.findByIdAndUpdate(
                userId,
                { avatarUrl },
                { new: true }
            );
        
            if (!user) {
                throw new Error("User không tồn tại");
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    },
    updateProfile: async (userId, {name, phoneNumber, address}) => {
        if(!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("UserId không hợp lệ");
        }
        
        try {
            const user = await User.findByIdAndUpdate(userId, 
                {name, phoneNumber, address},
                {new: true}
            );

            if(!user) {
                throw new Error("User không tồn tại");
            }

            return {
                name: user.name,
                phoneNumber: user.phoneNumber,
                address: user.address,
                message: "Cập nhật thông tin thành công"
            };
        }
        catch (error) {
            throw new Error(error.message);
        }
    },

    refreshAccessToken: async (refreshToken) => {
        try {
            const decoded = tokenService.validateRefreshToken(refreshToken);
            if (!decoded) throw new Error('Invalid refresh token');
    
            const user = await User.findById(decoded.id);
            if (!user) throw new Error('User not found');
    
            const newAccessToken = tokenService.generateAccessToken(user);
    
            return { accessToken: newAccessToken };
        } catch (error) {
            throw new Error('Token refresh failed: ' + error.message);
        }
    }
}

export default userService;