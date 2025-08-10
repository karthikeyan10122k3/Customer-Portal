import express from 'express';
import { verifyToken } from './../middleware/auth.middleware.js';
import { getCustomerProfile, getDashboard } from '../controllers/customer.controller.js';

const router = express.Router();

router.post('/dashboard', verifyToken,  getDashboard);
router.get('/profile', verifyToken, getCustomerProfile);


export default router;
