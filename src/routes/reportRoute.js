import express from "express";
import * as reportControllers from "../controllers/reportControllers.js";


const reportRoute = express.Router();

reportRoute.post("/create",reportControllers.createReport);

export default reportRoute;