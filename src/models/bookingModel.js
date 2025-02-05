import db from '../configs/database.js'
//เอาแค่ bookingname, start, end
export const getBookingInfo = async () =>{
    const [info] = await db.promise().query(
        `SELECT b.idBooking,b.User_idUser, concat(u.UserFname," ",u.UserLname) as Username, b.BookingName, b.Room_idRoom, b.BookingTimeIn, b.BookingTimeOut, b.BookingDuration
        FROM Booking as b join User as u on b.User_idUser = u.idUser`

    );
    return info
}



export const createBookingInfo = async (details,userId) =>{ await db.promise().query(
        `INSERT INTO Booking (BookingName,BookingTimeIn,BookingTimeOut,Room_idRoom,User_idUser) VALUES (?,?,?,?,?)`,[details.name,details.BookingTimeIn,details.BookingTimeOut,details.Room_idRoom,userId]

    );
    return details
}

export const checkBookingInfo = async (details, excludeBookingId = null) => {
    const query = `
        SELECT EXISTS(
            SELECT 1 FROM Booking
            WHERE Room_idRoom = ?
              AND (
                (BookingTimeIn <= ? AND BookingTimeOut >= ?) OR
                (BookingTimeIn <= ? AND BookingTimeOut >= ?) OR
                (BookingTimeIn >= ? AND BookingTimeOut <= ?)
              )
              ${excludeBookingId ? 'AND idBooking != ?' : ''}
        ) as checkResult;
    `;

    const params = [details.Room_idRoom, details.BookingTimeIn, details.BookingTimeIn, details.BookingTimeOut, details.BookingTimeOut, details.BookingTimeIn, details.BookingTimeOut];
    if (excludeBookingId) {
        params.push(excludeBookingId);
    }

    const [checkResult] = await db.promise().query(query, params);
    return checkResult[0];
};


export const selectCheckBeforeDelete = async (details,userId) => {
    const [selectcheck] =
    await db.promise().query( `select * from Booking where idBooking = ? and User_idUser = ?;`,[details.idBooking,userId]
);
return selectcheck
}

export const removeBookingInfo = async (details,userId) =>{ await db.promise().query(
    `DELETE FROM Booking WHERE idBooking = ? and User_idUser = ?`,[details.idBooking,userId]
);
}

export const updateBookingInfo = async (details,userId) =>{ await db.promise().query(
    `UPDATE Booking SET BookingName = ? , BookingTimeIn = ? ,BookingTimeOut = ? , Room_idRoom = ? WHERE idBooking = ? and User_idUser = ?`,[details.BookingName,details.BookingTimeIn,details.BookingTimeOut,details.Room_idRoom,details.idBooking,userId]
);
}