import * as reportModel from "../models/reportModel.js";

export const createReport = async (req,res) => {

    const reportdata = req.body

    try{
        const data = await reportModel.createReportInfo(reportdata);
        return res.status(200).json({
            success: true,
            data: data,
            massage: 'Create Report successfully'
        }); 
    }
    catch(error){
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      data: null,
      message: error.sqlMessage
    })
}}