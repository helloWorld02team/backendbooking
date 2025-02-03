import express from 'express'
import connectDB from "./utils/connectDatabase.js";
import userRoutes from './routes/userRoutes.js'
import cookieParser from 'cookie-parser';


const app = express();
const port = 3001;
await connectDB()

app.use(express.json());
app.use(cookieParser());
app.use('/api/user',userRoutes)

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})




