import db from '../configs/database.js'
//เอาแค่ bookingname, start, end
export const getBookingInfo = async () =>{
    const [info] = await db.promise().query(
        `SELECT BookingName, Room_idRoom, BookingTimeIn, BookingTimeOut, BookingDuration
        FROM Booking`
    );
    return info
}

export const createBookingInfo = async (details,userId) =>{ await db.promise().query(
        `INSERT INTO Booking (BookingName,BookingTimeIn,BookingTimeOut,Room_idRoom,User_idUser) VALUES (?,?,?,?,?)`,[details.name,details.timein,details.timeout,details.room,userId]
    );
    return details
}