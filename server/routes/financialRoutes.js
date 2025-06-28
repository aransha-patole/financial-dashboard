import express from 'express';
import userAuth from '../middleware/userAuth.js'; 
import {
  addFinancialEntry,
  getFinancialEntries,
  getFinancialAnalytics,
  updateFinancialEntry,
  deleteFinancialEntry,
  exportToCSV
} from '../controllers/financialController.js';

const router = express.Router();

// All routes require authentication
router.use(userAuth);

// Financial entries CRUD
router.post('/entries', addFinancialEntry);
router.get('/entries', getFinancialEntries);
router.put('/entries/:id', updateFinancialEntry);
router.delete('/entries/:id', deleteFinancialEntry);

// Analytics
router.get('/analytics', getFinancialAnalytics);

// Export
router.get('/export', exportToCSV);

export default router; 