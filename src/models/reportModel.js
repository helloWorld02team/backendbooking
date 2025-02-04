import db from '../configs/database.js'

export const createReportInfo = async (details) =>{ await db.promise().query(
    `INSERT INTO Report (ReportMessage,Room_idRoom,ReporterName,ReportDate) VALUES (?,?,?,?)`,[details.report,details.room,details.reporterName,details.time]
);
    return details
}