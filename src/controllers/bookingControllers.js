import * as bookingModel from "../models/bookingModel.js";
import jwt from "jsonwebtoken";

export const getBooking = async (req,res) => {
    try{
        const info = await bookingModel.getBookingInfo();
        return res.status(200).json({
            success: true,
            data: info,
            massage: 'Send Booking Info successfully'
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error"
        });
    }
};

export const createBooking = async (req,res) => {
    const bookingdata = req.body

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    if( check.checkResult == true || 1){
        return res.status(500).json({
            success: false,
            data: false,
            message: "Already have this Booking"
        });
    }

    try{
        const decodedCookie = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedCookie.id;

        const data = await bookingModel.createBookingInfo(bookingdata,userId);
        return res.status(200).json({
            success: true,
            data: data,
            massage: 'Create BookingInfo successfully'
        }); 
    }
    catch(error){
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      why: error,
      message: "Internal server error"
    })
}}