import { fetchInvoicePDFSapService } from '../services/finance/SapInvoicePdfService.js';
import { fetchInvoiceSapService } from '../services/finance/SapInvoiceServiceSap.js';
import { fetchMemosSapService } from '../services/finance/SapMemoServiceSap.js';
import { fetchOverAllSalesSapService } from '../services/finance/SAPOverAllSalesService.js';
import { fetchPaymentsAgingSapService } from '../services/finance/SAPPaymentsAgingService.js';

export const getInvoiceDetails = async (req, res) => {
  try {
     const customerId = req.user.customerId;

     
     let { fromDate, toDate, pageNum, pageSize, isSortNewest, documentNumber, status } = req.body;

    if(documentNumber != ''){
      documentNumber = documentNumber.toString().padStart(10, '0');
    }


    if (!customerId || typeof customerId !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid or missing customerId' });
    }

    const data = await fetchInvoiceSapService(customerId, fromDate, toDate, pageNum, pageSize, isSortNewest, documentNumber, status );
    res.json({ success: data.success, message: "Finance Invoice data retrived Successfully", data: data.invoice, totalRecords: data.totalRecords });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching invoice details', error });
  }
};

export const getInvoicePDF = async (req, res) => {
  try {
    const customerId = req.user.customerId;
    let { documentNumber } = req.body;

    if (documentNumber !== '') {
      documentNumber = documentNumber.toString().padStart(10, '0');
    }

    if (!customerId || typeof customerId !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid or missing customerId' });
    }
    
    const data = await fetchInvoicePDFSapService(customerId, documentNumber);
    const buffer = Buffer.from(data.pdfBase64, 'base64');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=invoice.pdf'); 
    res.send(buffer); 

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching invoice PDF', error });
  }
};


export const getPaymentsAndAging = async (req, res) => {
  try {
     const customerId = req.user.customerId;

     
     let { fromDate, toDate, pageNum, pageSize, isSortNewest, documentNumber, status } = req.body;

    if(documentNumber != ''){
      documentNumber = documentNumber.toString().padStart(10, '0');
    }

    if (!customerId || typeof customerId !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid or missing customerId' });
    }
  
    const data = await fetchPaymentsAgingSapService(customerId, fromDate, toDate, pageNum, pageSize, isSortNewest, documentNumber, status );
    
    res.json({ success: data.success, message: "Finance Payment and Aging data retrived Successfully", data: data.paymentsAging, totalRecords: data.totalRecords  });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching payments and aging', error });
  }
};

export const getMemos = async (req, res) => {
  try {
     const customerId = req.user.customerId;
    
     let { fromDate, toDate, pageNum, pageSize, isSortNewest, documentNumber, status, billingType } = req.body;


    if(documentNumber != ''){
      documentNumber = documentNumber.toString().padStart(10, '0');
    }

    if (!customerId || typeof customerId !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid or missing customerId' });
    }

    const data = await fetchMemosSapService(customerId, fromDate, toDate, pageNum, pageSize, isSortNewest, documentNumber, status, billingType );
    
    res.json({ success: data.success, message: "Finance Credit Debit Memos data retrived Successfully", data: data.memos, totalRecords: data.totalRecords });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching credit/debit memos', error });
  }
};
export const getOverAllSales = async (req, res) => {
  try {
     const customerId = req.user.customerId;


    if (!customerId || typeof customerId !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid or missing customerId' });
    }

    const data = await fetchOverAllSalesSapService(customerId);
    
    res.json(
      { 
        success: data.success, 
        message: "OverAll Sales data retrived Successfully", 
        overAllSalesSummary: data.summaryObject, 
        aging: data.aging, 
        paymentDetails: data.paymentDetails, 
        productSummary: data.productSummary, 
      });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching OverAll Sales Data', error });
  }
};