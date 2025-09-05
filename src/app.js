import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimiter from './middleware/rateLimiter.js';
import authRoutes from './routes/auth.js';
import txRoutes from './routes/transactions.js';
import bankRoutes from './routes/bank.js'


dotenv.config();


const app = express();
app.use(helmet());
app.use(express.json());
app.use(rateLimiter);


app.use('/api/auth', authRoutes);
app.use('/api/transactions', txRoutes);
app.use('/api/bankacc' , bankRoutes)


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


export default app;