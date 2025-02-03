import db from '../configs/database.js'

export const createReportInfo = async (details) =>{ await db.promise().query(
    `INSERT INTO report (ReportMessage,User_idUser,Room_idRoom) VALUES (?,?,?)`,[details.report,details.userid,details.room]
);
return details
}