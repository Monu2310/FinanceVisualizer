'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CATEGORIES } from '@/lib/constants';
import { IBudget } from '@/models/Budget';

export default function BudgetManager() {
  const [budgets, setBudgets] = useState<IBudget[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  const [newBudget, setNewBudget] = useState({
    category: '',
    amount: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/budgets?month=${currentMonth}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch budgets');
      }
      
      const data = await response.json();
      setBudgets(data.budgets);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchBudgets();
  }, [currentMonth, fetchBudgets]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBudget.category || !newBudget.amount) {
      setError('Category and amount are required');
      return;
    }

    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newBudget,
          amount: parseFloat(newBudget.amount),
          month: currentMonth
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create budget');
      }

      setNewBudget({ category: '', amount: '' });
      fetchBudgets();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(value);
  };

  const getAvailableCategories = () => {
    const usedCategories = budgets.map(b => b.category);
    return CATEGORIES.filter(cat => !usedCategories.includes(cat));
  };

  return (
    <Card className="w-full relative z-0 font-['Inter',_'SF_Pro_Display',_'Segoe_UI',_'Roboto',_'Helvetica_Neue',_'Arial',_sans-serif] bg-white border border-gray-200 shadow-sm">
      <CardHeader className="bg-white border-b border-gray-100 pb-6">
        <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg font-bold">₹</span>
          </div>
          Budget Manager
        </CardTitle>
        <div className="flex items-center gap-3 mt-4">
          <Label htmlFor="month" className="text-gray-700 font-medium">Select Month:</Label>
          <Input
            id="month"
            type="month"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(e.target.value)}
            className="w-44 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Add New Budget */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Budget</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative z-50">
                <Label htmlFor="category" className="text-gray-700 font-medium mb-2 block">Category</Label>
                <Select value={newBudget.category} onValueChange={(value) => setNewBudget(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="h-10 bg-white border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="z-50 max-h-60 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg">
                    {getAvailableCategories().map((category) => (
                      <SelectItem key={category} value={category} className="hover:bg-gray-50 cursor-pointer">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount" className="text-gray-700 font-medium mb-2 block">Budget Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newBudget.amount}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, amount: e.target.value }))}
                    className="h-10 pl-8 bg-white border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {loading ? 'Adding...' : 'Add Budget'}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Current Budgets */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Current Budgets</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="ml-3 text-gray-600">Loading budgets...</p>
            </div>
          ) : budgets.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-gray-400 text-xl">₹</span>
              </div>
              <p className="text-gray-500 font-medium">No budgets set for this month</p>
              <p className="text-gray-400 text-sm mt-1">Add your first budget above to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgets.map((budget) => (
                <Card key={budget._id} className="p-4 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">₹</span>
                        </div>
                        <p className="font-semibold text-gray-900">{budget.category}</p>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(budget.amount)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Monthly Budget</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
