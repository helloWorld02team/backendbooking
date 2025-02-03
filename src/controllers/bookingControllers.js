import * as bookingModel from "../models/bookingModel.js";

export const getBooking = async (req,res) => {
    try{
        const info = await bookingModel.getBookingInfo();
        return res.status(200).json({
            success: true,
            data: info,
            massage: 'Send BookingInfo successfully'
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

    try{
        const data = await bookingModel.createBookingInfo(bookingdata);
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
      data: null,
      message: "Internal server error"
    })
}}