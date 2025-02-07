import express from 'express'
import connectDB from "./utils/connectDatabase.js";
import userRoutes from './routes/userRoutes.js'
import cookieParser from 'cookie-parser';
import bookingRoute from './routes/bookingRoutes.js';
import reportRoute from './routes/reportRoute.js';
import cors from 'cors'
const app = express();
const port = 3001;
await connectDB()

app.use(cookieParser());
app.use(express.json());
app.use(cors({credentials: true, origin: 'http://localhost:5173'}))
app.use('/api/user',userRoutes)
app.use("/api/booking",bookingRoute)
app.use("/api/report",reportRoute)


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})




