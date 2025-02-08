import db from '../configs/database.js'

export const getUser = async ()=>{
    const [response] = await db.promise().query(
        `SELECT * FROM User`
    )

    return response
}

export const getUserByEmail = async (userEmail)=>{
    const [response] = await db.promise().query(
        `SELECT * FROM User WHERE UserEmail=?`,[userEmail]
    )
    return response[0]

}
