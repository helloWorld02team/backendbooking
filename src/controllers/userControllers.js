import * as userModels from '../models/userModels.js'
import * as cookeAuthen from '../utils/cookieAuthen.js'
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';


export const getUser = async (req,res) =>{
    try{
        const users = await userModels.getUser();
        return res.status(200).json({
            status:'Success',
            data: users,
            message:'All users retrieve'
        })
    }

    catch (e){
        console.log(e)
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error",
        });
    }
}

export const loginUser = async (req, res) => {
    const { userEmail, userPassword } = req.body;

    const token = req.cookies.token;
    if (token) {
        try {
            cookeAuthen.verifyToken(token)
            return res.status(400).json({ message: 'User already logged in, Please logout first to login again' });
        } catch (error) {
            // If the token is invalid, proceed with the login process
        }
    }

    try {
        const user = await userModels.getUserByEmail(userEmail); //check for existing email=>user
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (user.UserPassword !== userPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({
            id:user.idUser,
            userFname:user.UserFname,
            userLname:user.UserLname,
            email:user.UserEmail
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log(user.UserEmail,"has logged in")

        cookeAuthen.setTokenCookie(res, token); //add cookie to browser

        return res.status(200).json({
            message: 'Login successful'
        });

    } catch (error) {
        console.log('error during login',error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

export const logoutUser =(req,res)=>{
    const token = req.cookies.token;
    if (!token){
        return res.status(401).json({
            message:'You are not currently logged in',
        })
    }
    const decodedCookie = jwt.verify(token, process.env.JWT_SECRET);
    res.clearCookie('token');
    console.log(decodedCookie.email,"has logged out")
    return res.status(200).json({
        message:'logout successfully'
    })

}

export const someProtectedRoute = async (req, res) => {
    const token = req.cookies.token; // Access token from cookie

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decodedCookie = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({
            message: 'Token is valid',
            access:'allowed',
            cred: {
                id: decodedCookie.id,
                userFname: decodedCookie.userFname,
                userLname: decodedCookie.userLname,
                email: decodedCookie.email
            },
        });
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid token',
            access:'denied',
            dev:error
        });
    }
};