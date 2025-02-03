import db from '../configs/database.js'
//เอาแค่ bookingname, strat, end
export const getBookingInfo = async () =>{
    const [info] = await db.promise().query(
        `SELECT b.User_idUser, concat(u.UserFname," ",u.UserLname) as Username, b.BookingName, b.Room_idRoom, b.BookingTimeIn, b.BookingTimeOut, b.BookingDuration
        FROM Booking as b join User as u on b.User_idUser = u.idUser`
    );
    return info
}

export const createBookingInfo = async (details) =>{ await db.promise().query(
        `INSERT INTO Booking (BookingName,BookingTimeIn,BookingTimeOut,Room_idRoom,User_idUser) VALUES (?,?,?,?,?)`,[details.name,details.timein,details.timeout,details.room,details.userid]
    );
    return details
}

export const checkBookingInfo = async (details) =>{
    await db.promise().query(

    );
}