import express from 'express'
import connectDB from "./src/utils/connectDatabase.js";

const app = express();
const port = 3001;
await connectDB()

app.use(express.json())

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})




