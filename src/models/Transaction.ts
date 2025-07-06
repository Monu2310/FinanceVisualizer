import mongoose from 'mongoose';

export interface ITransaction {
  _id?: string;
  amount: number;
  description: string;
  date: Date;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [255, 'Description cannot exceed 255 characters']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Food & Dining', 'Groceries', 'Transportation', 'Bills & Utilities', 'Entertainment', 'Health & Medical', 'Education', 'Shopping', 'Travel', 'Other']
  }
}, {
  timestamps: true
});

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
