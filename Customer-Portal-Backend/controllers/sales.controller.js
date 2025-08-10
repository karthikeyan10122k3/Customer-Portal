
import { fetchDeliveriesSapService } from '../services/sales/sapDeliveryService.js';
import { fetchInquiriesSapService } from '../services/sales/sapInquiryService.js';
import { fetchSalesOrderSapService } from '../services/sales/sapSalesOrderService.js';

export const getInquiries = async (req, res) => {
  try {
    const customerId = req.user.customerId;
    
    let { fromDate, toDate, pageNum, pageSize, isSortNewest, documentNumber, status } = req.body;
    if(documentNumber != ''){
      documentNumber = documentNumber.toString().padStart(10, '0');
    }

    if (!customerId || typeof customerId !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid or missing customerId' });
    }

    const data = await fetchInquiriesSapService(customerId, fromDate, toDate, pageNum, pageSize, isSortNewest, documentNumber, status );
    
    res.json({ success: data.success, message: data.message, data : data.inquiries, totalRecords: data.totalRecords});
  } catch (error) {
    res.status(500).json({ success: error.success, message: error.message  });
  }
};

export const getSalesOrders = async (req, res) => {
  try {
    const customerId = req.user.customerId;

    let { fromDate, toDate, pageNum, pageSize, isSortNewest, documentNumber, status } = req.body;

    if(documentNumber != ''){
      documentNumber = documentNumber.toString().padStart(10, '0');
    }


  if (!customerId || typeof customerId !== 'string') {
    return res.status(400).json({ success: false, message: 'Invalid or missing customerId' });
  }

    const data = await fetchSalesOrderSapService(customerId, fromDate, toDate, pageNum, pageSize, isSortNewest, documentNumber, status );
    res.json({ success: true, message: "Sales Orders data retrived Successfully", data : data.salesOrders, totalRecords: data.totalRecords});
  } catch (error) {
    res.status(500).json({ success: error.success, message: error.message});
  }
};

export const getDeliveries = async (req, res) => {
  try {
    const customerId = req.user.customerId;
    
    let { fromDate, toDate, pageNum, pageSize, isSortNewest, documentNumber, status } = req.body;

    if(documentNumber != ''){
      documentNumber = documentNumber.toString().padStart(10, '0');
    }

  if (!customerId || typeof customerId !== 'string') {
    return res.status(400).json({ success: false, message: 'Invalid or missing customerId' });
  }
  
    const data = await fetchDeliveriesSapService(customerId, fromDate, toDate, pageNum, pageSize, isSortNewest, documentNumber, status );
    res.json({ success: true, message: "Sales Deliveries data retrived Successfully", data : data.deliveries, totalRecords: data.totalRecords});

  } catch (error) {
    res.status(500).json({ success: error.success, message: error.message});
  }
};
