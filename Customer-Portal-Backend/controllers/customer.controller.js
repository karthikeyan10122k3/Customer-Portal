
import { fetchDashboardSapService } from '../services/customer/SAPDashboardService.js';
import { fetchCustomerProfileSapService } from '../services/customer/SAPprofileService.js';


export const getCustomerProfile = async (req, res) => {
  try {
    const customerId = req.user.customerId;
    
    if (!customerId || typeof customerId !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid or missing customerId' });
    }

    console.log("IM HEREEE");
    
  
    const data = await fetchCustomerProfileSapService(customerId);
    
    res.json({ success: data.success, message: "Customer Profile data retrived Successfully", data : data.profile });
  } catch (error) {
    res.status(500).json({ success: error.success, message: error.message });
  }
};


export const getDashboard = async (req, res) => {
  try {
    const customerId = req.user.customerId;
    if (!customerId || typeof customerId !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid or missing customerId' });
    }

    const { fromDate, toDate } = req.body;


    const data = await fetchDashboardSapService(customerId, fromDate, toDate);
    console.log(data.message);
    
    res.json({success: true, message: "Dashboard data retrived Successfully", kpis: data.kpis, topProducts: data.topProducts, trends: data.trends, });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching dashboard data', error });
  }
};


