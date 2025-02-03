import jwt from 'jsonwebtoken';

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

export const setTokenCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,  // Prevents JavaScript access
        secure: process.env.NODE_ENV === "production", // Enable only in HTTPS
        sameSite: "strict", // Helps prevent CSRF
        maxAge: 3600000, // 1 hour
    });
};