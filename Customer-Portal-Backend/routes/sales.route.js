import express from 'express';
import { getDeliveries, getInquiries, getSalesOrders } from '../controllers/sales.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/inquiries', verifyToken, getInquiries);
router.post('/sales-orders', verifyToken, getSalesOrders);
router.post('/deliveries', verifyToken, getDeliveries);

export default router;
