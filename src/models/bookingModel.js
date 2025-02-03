import db from '../configs/database.js'
//เอาแค่ bookingname, strat, end
export const getBookingInfo = async () =>{
    const [info] = await db.promise().query(
        `SELECT BookingName, Room_idRoom, BookingTimeIn, BookingTimeOut, BookingDuration
        FROM booking`
    );
    return info
}

export const createBookingInfo = async (details) =>{ await db.promise().query(
        `INSERT INTO booking (BookingName,BookingTimeIn,BookingTimeOut,Room_idRoom,User_idUser) VALUES (?,?,?,?,?)`,[details.name,details.timein,details.timeout,details.room,details.userid]
    );
    return details
}