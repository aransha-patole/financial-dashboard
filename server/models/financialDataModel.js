import mongoose from 'mongoose';

const financialDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense', 'investment', 'savings'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String
  }],
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
financialDataSchema.index({ userId: 1, date: -1 });
financialDataSchema.index({ userId: 1, type: 1 });

const FinancialData = mongoose.models.financialData || mongoose.model('financialData', financialDataSchema);
export default FinancialData; 