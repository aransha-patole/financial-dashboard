import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import financialRouter from './routes/financialRoutes.js';

const app = express();
const port = process.env.PORT || 4000

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5174', 
  credentials: true                
}));

//API Endpoints
app.get('/', (req, res) => 
  res.send('Hello World'));
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/financial', financialRouter)

app.listen(port,()=>  console.log(`Server is running on port ${port}`));
