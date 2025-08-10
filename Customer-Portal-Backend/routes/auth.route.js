import express from 'express';
import { isAuthenticated, login, logout } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/logout
router.get('/logout', logout);

// GET /api/auth/isAuthenticated
router.get('/isAuthenticated', verifyToken , isAuthenticated);

export default router;
