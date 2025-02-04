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

    try{
        const checkResult = await bookingModel.checkBookingInfo(bookingdata);
        if (checkResult.checkResult){
            return res.status(400).json({
                success: false,
                data: false,
                message: "Already have this Booking"
            });
        }
        const decodedCookie = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedCookie.id;

        const data = await bookingModel.createBookingInfo(bookingdata,userId);
        console.log()
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

export const deleteBooking = async (req,res) => {
    const bookingdata = req.body
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    } 

    try{

        const decodedCookie = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedCookie.id;

        const selectcheck = await bookingModel.selectCheckBeforeDelete(bookingdata,userId);
                if(selectcheck.length > 0){
                    const data = await bookingModel.removeBookingInfo(bookingdata,userId);
                    return res.status(200).json({
                        success: true,
                        data: data,
                        massage: 'Remove BookingInfo successfully'
                    }); 
                }
                return res.status(500).json({
                    success: false,
                    why: "User dont have a permission to delete",
                    message: "User access failure" 
                })}
    catch(error){
        console.error("Error:", error);
        return res.status(500).json({
          success: false,
          why: error,
          message: "Internal server error"
    })
}}