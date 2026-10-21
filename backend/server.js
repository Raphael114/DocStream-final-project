import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
import jobRouter from './routes/jobRoute.js';
import chatRouter from './routes/chatRoute.js';

const app = express();
const port = process.env.PORT || 4000;
const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
connectDB();
connectCloudinary();

//middleware
// Configure CORS to allow frontend origin when provided, otherwise allow all
const corsOptions = {}
if (process.env.FRONTEND_URL) corsOptions.origin = process.env.FRONTEND_URL
app.use(cors(Object.keys(corsOptions).length ? corsOptions : undefined));
app.use(express.json());
app.use('/doctor-images', express.static(path.resolve(backendDirectory, 'doctor-images')));

//api endpoints
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)
app.use('/api/jobs', jobRouter)
app.use('/api/chat', chatRouter)


app.get('/', (req, res) => {
  res.send('Welcome  to the backend server!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});