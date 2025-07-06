'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ITransaction } from '@/models/Transaction';
import { CATEGORIES } from '@/lib/constants';

interface TransactionFormProps {
  transaction?: ITransaction;
  onSubmit: (transaction: Omit<ITransaction, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel?: () => void;
}

export default function TransactionForm({ transaction, onSubmit, onCancel }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    amount: transaction?.amount.toString() || '',
    description: transaction?.description || '',
    date: transaction?.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    category: transaction?.category || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || isNaN(parseFloat(formData.amount))) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 255) {
      newErrors.description = 'Description cannot exceed 255 characters';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        date: new Date(formData.date),
        category: formData.category
      });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <Label htmlFor="amount" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></span>
            Amount (₹)
          </Label>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="0.00"
              disabled={isSubmitting}
              className="pl-8 h-12 border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 transition-all duration-300 bg-white/50 backdrop-blur-sm"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">₹</span>
          </div>
          {errors.amount && (
            <Alert className="py-2 border-red-200 bg-red-50 animate-shake">
              <AlertDescription className="text-red-700">{errors.amount}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <Label htmlFor="description" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></span>
            Description
          </Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter transaction description"
            disabled={isSubmitting}
            className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-all duration-300 bg-white/50 backdrop-blur-sm"
          />
          {errors.description && (
            <Alert className="py-2 border-red-200 bg-red-50 animate-shake">
              <AlertDescription className="text-red-700">{errors.description}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <Label htmlFor="category" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-pink-400 to-red-400 rounded-full"></span>
              Category
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
              <SelectTrigger className="h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400 transition-all duration-300 bg-white/50 backdrop-blur-sm">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="glass z-50 max-h-60 overflow-auto">
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category} className="hover:bg-indigo-50 transition-colors">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <Alert className="py-2 border-red-200 bg-red-50 animate-shake">
                <AlertDescription className="text-red-700">{errors.category}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <Label htmlFor="date" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></span>
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              disabled={isSubmitting}
              className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-300 bg-white/50 backdrop-blur-sm"
            />
            {errors.date && (
              <Alert className="py-2 border-red-200 bg-red-50 animate-shake">
                <AlertDescription className="text-red-700">{errors.date}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex gap-3 pt-6 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                transaction ? 'Update Transaction' : 'Add Transaction'
              )}
            </Button>
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel} 
                disabled={isSubmitting}
                className="h-12 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>
  );
}
