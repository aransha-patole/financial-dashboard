import mongoose from 'mongoose';
import FinancialData from '../models/financialDataModel.js';

// Add new financial entry
export const addFinancialEntry = async (req, res) => {
  try {
    const { type, category, amount, description, date, tags, isRecurring, recurringFrequency } = req.body;
    const userId = req.user.userId;


    const newEntry = new FinancialData({
      userId,
      type,
      category,
      amount,
      description,
      date: date || new Date(),
      tags,
      isRecurring,
      recurringFrequency
    });

    const savedEntry = await newEntry.save();
    res.status(201).json({
      success: true,
      message: 'Financial entry added successfully',
      data: savedEntry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding financial entry',
      error: error.message
    });
  }
};

// Get all financial entries for a user
export const getFinancialEntries = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { type, category, startDate, endDate, page = 1, limit = 10 } = req.query;

    let query = { userId };

    // Apply filters
    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const entries = await FinancialData.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await FinancialData.countDocuments(query);

    res.status(200).json({
      success: true,
      data: entries,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalEntries: total,
        entriesPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching financial entries',
      error: error.message
    });
  }
};

// Get financial analytics
export const getFinancialAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    // Get total income and expenses
    const incomeResult = await FinancialData.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), type: 'income', ...dateFilter } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const expenseResult = await FinancialData.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), type: 'expense', ...dateFilter } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Get category-wise breakdown
    const categoryBreakdown = await FinancialData.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), ...dateFilter } },
      { $group: { _id: { type: '$type', category: '$category' }, total: { $sum: '$amount' } } },
      { $group: { _id: '$_id.type', categories: { $push: { category: '$_id.category', total: '$total' } } } }
    ]);

    // Get monthly trends
    const monthlyTrends = await FinancialData.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), ...dateFilter } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const totalIncome = incomeResult[0]?.total || 0;
    const totalExpense = expenseResult[0]?.total || 0;
    const netIncome = totalIncome - totalExpense;

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalIncome,
          totalExpense,
          netIncome,
          savingsRate: totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(2) : 0
        },
        categoryBreakdown,
        monthlyTrends
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};

// Update financial entry
export const updateFinancialEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const updateData = req.body;

    const entry = await FinancialData.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Financial entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Financial entry updated successfully',
      data: entry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating financial entry',
      error: error.message
    });
  }
};

// Delete financial entry
export const deleteFinancialEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;


    const entry = await FinancialData.findOneAndDelete({ _id: id, userId });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Financial entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Financial entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting financial entry',
      error: error.message
    });
  }
};

// Export data to CSV format
export const exportToCSV = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { startDate, endDate, type } = req.query;

    let query = { userId };
    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const entries = await FinancialData.find(query).sort({ date: -1 });

    // Convert to CSV format
    const csvHeader = 'Date,Type,Category,Amount,Description,Tags\n';
    const csvData = entries.map(entry => {
      return `${entry.date.toISOString().split('T')[0]},${entry.type},${entry.category},${entry.amount},${entry.description.replace(/,/g, ';')},${entry.tags.join(';')}`;
    }).join('\n');

    const csvContent = csvHeader + csvData;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=financial_data.csv');
    res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error exporting data',
      error: error.message
    });
  }
}; 