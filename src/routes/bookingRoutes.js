import express from "express";
import * as bookingControllers from "../controllers/bookingControllers.js";


const bookingRoute = express.Router();

bookingRoute.get("/", bookingControllers.getBooking);
bookingRoute.post("/create",bookingControllers.createBooking);

export default bookingRoute;