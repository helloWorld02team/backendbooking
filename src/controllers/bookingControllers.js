import * as bookingModel from "../models/bookingModel.js";
import { addWeeks, addMonths } from "date-fns";
import { verifyToken } from "../utils/cookieAuthen.js";

export const getBooking = async (req, res) => {
    try {
        const info = await bookingModel.getBookingInfo();

        const infoFormat = info.map(element => ({
            ...element,
            BookingTimeIn: new Date(element.BookingTimeIn).toISOString().replace('T', ' ').replace('.000Z', ''),
            BookingTimeOut: new Date(element.BookingTimeOut).toISOString().replace('T', ' ').replace('.000Z', '')
            
        }));
        
      
        return res.status(200).json({
            success: true,
            data: info,
            message: "Booking data retrieved successfully",
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);

           
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to retrieve booking data",
        });
    }
};

export const createBooking = async (req, res) => {
    const bookingdata = req.body;

    try {
        const decodedCookie = verifyToken(req);
        const userId = decodedCookie.id;

        let currentStart = new Date(bookingdata.timein);
        let currentEnd = new Date(bookingdata.timeout);
        const repeatEndDate = bookingdata.repeatEndDate
            ? new Date(bookingdata.repeatEndDate)
            : null;
        const repeatType = bookingdata.repeatType;

        const bookingOccurrences = [];

        if (!repeatType) {
            // Single booking (no repeat)
            bookingOccurrences.push({
                ...bookingdata,
                timein: currentStart,
                timeout: currentEnd,
            });

        } else {
            // Handle repeating bookings
            while (currentStart <= repeatEndDate) {
                bookingOccurrences.push({
                    ...bookingdata,
                    timein: new Date(currentStart),
                    timeout: new Date(currentEnd),
                });

                if (repeatType === "weekly") {
                    currentStart = addWeeks(currentStart, 1);
                    currentEnd = addWeeks(currentEnd, 1);
                } else if (repeatType === "monthly") {
                    currentStart = addMonths(currentStart, 1);
                    currentEnd = addMonths(currentEnd, 1);
                }
            }
        }

        // Check all occurrences before inserting
        for (const occurrence of bookingOccurrences) {
            const checkResult = await bookingModel.checkBookingInfo(occurrence);
            if (checkResult.checkResult) {
                return res.status(400).json({
                    success: false,
                    error: "BOOKING_CONFLICT",
                    message: `Booking conflict on ${occurrence.timein}. Please choose another time.`,
                });
            }
        }

        // Insert all occurrences if no conflicts
        for (const occurrence of bookingOccurrences) {
            await bookingModel.createBookingInfo(occurrence, userId);
        }

        return res.status(200).json({
            success: true,
            message: repeatType
                ? "All repeating bookings created successfully"
                : "Single booking created successfully",
        });
    } catch (error) {
        console.error("Error creating booking:", error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to create booking due to a server error",
        });
    }
};

export const deleteBooking = async (req, res) => {
    const bookingdata = req.body;

    try {
        const decodedCookie = verifyToken(req);
        const userId = decodedCookie.id;

        const selectCheck = await bookingModel.selectCheckBeforeDelete(
            bookingdata,
            userId
        );

        if (selectCheck.length > 0) {
            const data = await bookingModel.removeBookingInfo(bookingdata, userId);
            return res.status(200).json({
                success: true,
                data: data,
                message: "Booking deleted successfully",
            });
        }

        return res.status(403).json({
            success: false,
            error: "UNAUTHORIZED_DELETE",
            message: "You do not have permission to delete this booking.",
        });
    } catch (error) {
        console.error("Error deleting booking:", error);
        return res.status(500).json({

            success: false,
            error: error.message,
            message: "Failed to delete booking due to a server error",
        });
    }
};



export const UpdateBooking = async (req,res) => {
    const bookingdata = req.body
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    } 

    try{

        const decodedCookie = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedCookie.id;

        const checkResult = await bookingModel.checkBookingInfo(bookingdata)
                if(!checkResult){
                    const data = await bookingModel.updateBookingInfo(bookingdata,userId);
                    return res.status(200).json({
                        success: true,
                        data: data,
                        massage: 'Update BookingInfo successfully'
                    }); 
                }
                return res.status(500).json({
                    success: false,
                    why: "มึงอัพวันซ้ำกับคนอื่นครับ",
                    message: "User มึงอัพไม่ได้ไอควาย" 
                })}
    catch(error){
        console.error("Error:", error);
        return res.status(500).json({
          success: false,
          why: error,
          message: "Internal server error"
    })
}}

