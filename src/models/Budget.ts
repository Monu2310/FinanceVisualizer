import mongoose from 'mongoose';

export interface IBudget {
  _id?: string;
  category: string;
  amount: number;
  month: string; // YYYY-MM format
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Food & Dining', 'Groceries', 'Transportation', 'Bills & Utilities', 'Entertainment', 'Health & Medical', 'Education', 'Shopping', 'Travel', 'Other']
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [0.01, 'Budget amount must be greater than 0']
  },
  month: {
    type: String,
    required: [true, 'Month is required'],
    match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format']
  }
}, {
  timestamps: true
});

// Ensure unique budget per category per month
BudgetSchema.index({ category: 1, month: 1 }, { unique: true });

export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);
