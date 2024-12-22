import jwt from 'jsonwebtoken';

const tokenService = {
    // Generate access token
    generateAccessToken: (user) => {
        return jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '1h' }
        );
    },   
    // Generate refresh token
    generateRefreshToken: (user) => {
        return jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '30d' }
        );
    },    
    // Validate refresh token
    validateRefreshToken: (refreshToken) => {
        try {
            return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            return null;
        }
    }
}

export default tokenService;