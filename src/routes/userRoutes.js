import * as userControllers from '../controllers/userControllers.js'
import {validateLogin} from "../middlewares/authenMiddlewares.js"
import express from 'express'

const userRoutes = express.Router();

userRoutes.get("/getalluser",userControllers.getUser);

userRoutes.post("/login",validateLogin,userControllers.loginUser);

userRoutes.get('/protected', userControllers.someProtectedRoute);

userRoutes.post("/logout",userControllers.logoutUser);


export default userRoutes