import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { authenticateCustomerSapService } from './../services/authService.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const login = async (req, res) => {
  try {
    let { customerId, password, rememberMe } = req.body;
    console.log(customerId, password, rememberMe);
    

    if (!customerId || !password) {
      return res.status(400).json({ success: false, message: 'Customer ID and password are required' });
    }

     customerId = customerId.toString().padStart(10, '0');
 
     const customer = await authenticateCustomerSapService(customerId, password);

    if (!customer || customer.loginSuccess ==='N') {
      return res.status(401).json({ success: false, message: customer.message });
    }

    const token = jwt.sign(
      { customerId: customer.customerId, name: customer.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

      if(rememberMe){
        res.cookie('customerToken', token, {
          httpOnly: true,
          secure: false,
          sameSite: 'Lax',
          maxAge: 1 * 24 * 60 * 60 * 1000  
        });
      }else{
        res.cookie('customerToken', token, {
          httpOnly: true,
          secure: false,
          sameSite: 'Lax', 
        });
      }
            
    res.status(200).json({
      success: true,
      message: customer.message,
    });
  } catch (error) {
    console.log(error.success, error.message);
    
    res.status(500).json({ success: error.success, message: error.message });
  }
};

export const logout = (req, res) => {
  
  res.clearCookie('customerToken', {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax'
  });

  return res.status(200).json({ message: 'Logged out successfully' });
};

export const isAuthenticated = (req, res) => {
  try {
    const name = req.user.name;

      return res.status(200).json({ isAuthenticated: true, message: 'Authenticated', name: name });

  } catch (error) {
    if (!res.headersSent) {
      return res.status(500).json({ isAuthenticated: false, message: 'Internal server error' });
    }
  }
};

