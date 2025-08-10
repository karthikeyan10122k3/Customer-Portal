import express from 'express';
import {
  getInvoiceDetails,
  getPaymentsAndAging,
  getInvoicePDF,
  getMemos,
  getOverAllSales
} from '../controllers/financial.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/invoices', verifyToken, getInvoiceDetails);
router.post('/invoices-pdf', verifyToken, getInvoicePDF);
router.post('/payments-aging', verifyToken,  getPaymentsAndAging);
router.post('/memos', verifyToken, getMemos);
router.get('/overAllSales', verifyToken, getOverAllSales);

export default router;
