import jwt from 'jsonwebtoken';

export const verifyToken = (req) => {
    const token = req.cookies.token;

    if (!token) {
        throw { status: 401, error: "AUTH_MISSING", message: "No token provided. Authentication required." };
    }

    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw { status: 403, error: "INVALID_TOKEN", message: "Invalid or expired token. Please log in again." };
    }
};

export const setTokenCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
        maxAge: 3600000
    });
};
