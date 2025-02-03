import express from 'express'
import connectDB from "./utils/connectDatabase.js";
import bookingRoute from './routes/bookingRoutes.js';
import reportRoute from './routes/reportRoute.js';

const app = express();
const port = 3001;

await connectDB()

app.use(express.json())
app.use("/api/booking",bookingRoute)
app.use("/api/report",reportRoute)

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})




