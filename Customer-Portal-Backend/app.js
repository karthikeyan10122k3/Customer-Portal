import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';


//Routes
import loginRoutes from './routes/auth.route.js'
import customerRoutes from './routes/customer.route.js';
import salesRoutes from './routes/sales.route.js';
import financeRoutes from './routes/finance.route.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:4000',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser())

// Testing
app.get('/', (req, res) => {
  res.send('Customer Portal API is live!!');
});


// Routes
app.use('/customerPortal/api/auth', loginRoutes);
app.use('/customerPortal/api/customer', customerRoutes);
app.use('/customerPortal/api/sales', salesRoutes);
app.use('/customerPortal/api/finance', financeRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;
