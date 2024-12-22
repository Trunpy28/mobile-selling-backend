import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authMiddleware = async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }

    const accessToken = req.headers.authorization.split(' ')[1];
    if (!accessToken) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }
        req.user = currentUser;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }
}

export const adminAuthMiddleware = (req, res, next) => {
    if(!req.user) {
        return res.status(401).json({
            message: "User not signed in"
        })
    }
    
    if(req.user.role !== "Admin") {
        return res.status(403).json({
            message: "Unauthorized, you must be an admin"
        })
    }

    next();
}

