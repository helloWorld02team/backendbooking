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
            data: infoFormat,
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
    const bookingData = req.body;

    try {
        const decodedCookie = verifyToken(req);
        const userId = decodedCookie.id;

        let currentStart = new Date(bookingData.BookingTimeIn);
        let currentEnd = new Date(bookingData.BookingTimeOut);
        const repeatEndDate = bookingData.repeatEndDate
            ? new Date(bookingData.repeatEndDate)
            : null;
        const repeatType = bookingData.repeatType;

        const bookingOccurrences = [];
        let createdCount = 0;

        // Generate all occurrences first
        if (!repeatType) {
            // Single booking (no repeat)
            bookingOccurrences.push({
                ...bookingData,
                BookingTimeIn: currentStart,
                BookingTimeOut: currentEnd,
            });
        } else {
            // Handle repeating bookings
            while (currentStart <= repeatEndDate) {
                bookingOccurrences.push({
                    ...bookingData,
                    BookingTimeIn: new Date(currentStart),
                    BookingTimeOut: new Date(currentEnd),
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

        // Check all occurrences one by one for conflicts
        for (const occurrence of bookingOccurrences) {
            const checkResult = await bookingModel.checkBookingInfo(occurrence);
            if (checkResult.checkResult) {
                return res.status(400).json({
                    success: false,
                    error: "BOOKING_CONFLICT",
                    message: `Booking conflict on ${occurrence.BookingTimeIn}. Please choose another time.`,
                });
            }
        }

        // Insert all occurrences if no conflicts
        for (const occurrence of bookingOccurrences) {
            await bookingModel.createBookingInfo(occurrence, userId);
            createdCount++;
        }

        return res.status(200).json({
            success: true,
            message: repeatType
                ? `All ${createdCount} repeating bookings created successfully`
                : "Single booking created successfully",
            createdBookings: createdCount,
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

export const UpdateBooking = async (req, res) => {
    const bookingdata = req.body;

    try {
        const decodedCookie = verifyToken(req);
        const userId = decodedCookie.id;
        const checkResult = await bookingModel.checkBookingInfo(bookingdata, bookingdata.idBooking);
        const selectCheck = await bookingModel.selectCheckBeforeDelete(
            bookingdata,
            userId
        );


        if (!checkResult.checkResult&&selectCheck.length>0) {
            const data = await bookingModel.updateBookingInfo(bookingdata, userId);
            return res.status(200).json({
                success: true,
                data: data,
                message: 'Update BookingInfo successfully',
            });
        }
        return res.status(400).json({
            success: false,
            error: "BOOKING_CONFLICT",
            message: "Booking conflict. Please choose another time.",
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal server error",
        });
    }
};