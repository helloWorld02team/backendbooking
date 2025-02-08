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
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://helloworld02.sit.kmutt.ac.th"
];

app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api/user',userRoutes)
app.use("/api/booking",bookingRoute)
app.use("/api/report",reportRoute)


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})




