import * as userControllers from '../controllers/userControllers.js'
import {validateLogin} from "../middlewares/authenMiddlewares.js"
import express from 'express'

const userRoutes = express.Router();

userRoutes.post("/login",validateLogin,userControllers.loginUser);

userRoutes.get('/getuserdata', userControllers.getUserData);

userRoutes.post("/logout",userControllers.logoutUser);


export default userRoutes