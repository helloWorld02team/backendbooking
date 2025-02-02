import connection from "../configs/database.js";

const connectDB = async () => {
    await connection.connect((err) => {
        if (err) {
            console.log("database failed to connect")
            console.log(err)
        } else {
            console.log('database is connected')
        }
    })
}


export default connectDB