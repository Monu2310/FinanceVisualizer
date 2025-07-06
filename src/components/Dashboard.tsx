'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionList from './TransactionList';
import MonthlyExpensesChart from './MonthlyExpensesChart';
import CategoryPieChart from './CategoryPieChart';
import BudgetManager from './BudgetManager';
import BudgetComparisonChart from './BudgetComparisonChart';
import { ITransaction } from '@/models/Transaction';

export default function Dashboard() {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [summaryStats, setSummaryStats] = useState({
    totalExpenses: 0,
    transactionCount: 0,
    avgTransaction: 0,
    monthlyExpenses: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      console.log('Fetching transactions...');
      setLoading(true);
      const response = await fetch('/api/transactions');
      
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      
      const data = await response.json();
      console.log('Fetched transactions:', data.transactions.length);
      setTransactions(data.transactions);
      calculateSummaryStats(data.transactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const calculateSummaryStats = (transactions: ITransaction[]) => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    const monthlyTransactions = transactions.filter(t => 
      new Date(t.date).toISOString().slice(0, 7) === currentMonth
    );
    
    const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
    const monthlyExpenses = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    setSummaryStats({
      totalExpenses,
      transactionCount: transactions.length,
      avgTransaction: transactions.length > 0 ? totalExpenses / transactions.length : 0,
      monthlyExpenses
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="relative inline-block">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-purple-200 border-b-purple-600 rounded-full animate-ping opacity-20"></div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 animate-pulse">
              Personal Finance Dashboard
            </h1>
            <p className="text-gray-600 animate-bounce">Loading your financial data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-8 animate-fadeInUp">
          <div className="relative inline-block mb-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Personal Finance Dashboard
            </h1>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-ping"></div>
          </div>
          <p className="text-gray-600 text-lg animate-slideInFromLeft" style={{ animationDelay: '0.2s' }}>
            🇮🇳 Comprehensive overview of your financial health
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="group hover-lift glass border-0 ring-1 ring-gray-200/50 hover:ring-indigo-300/50 transition-all duration-300 animate-slideInFromLeft" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">₹</span>
                </div>
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {formatCurrency(summaryStats.totalExpenses)}
              </div>
              <p className="text-xs text-gray-500 mt-1">All time spending</p>
            </CardContent>
          </Card>
          
          <Card className="group hover-lift glass border-0 ring-1 ring-gray-200/50 hover:ring-purple-300/50 transition-all duration-300 animate-slideInFromLeft" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 group-hover:text-purple-600 transition-colors flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">📅</span>
                </div>
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {formatCurrency(summaryStats.monthlyExpenses)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Current month spending</p>
            </CardContent>
          </Card>
          
          <Card className="group hover-lift glass border-0 ring-1 ring-gray-200/50 hover:ring-blue-300/50 transition-all duration-300 animate-slideInFromLeft" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">📊</span>
                </div>
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {summaryStats.transactionCount}
              </div>
              <p className="text-xs text-gray-500 mt-1">Total recorded</p>
            </CardContent>
          </Card>
          
          <Card className="group hover-lift glass border-0 ring-1 ring-gray-200/50 hover:ring-emerald-300/50 transition-all duration-300 animate-slideInFromLeft" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 group-hover:text-emerald-600 transition-colors flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">📈</span>
                </div>
                Average
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {formatCurrency(summaryStats.avgTransaction)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Per transaction</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyExpensesChart />
              <CategoryPieChart />
            </div>
          </TabsContent>
          
          <TabsContent value="transactions">
            <TransactionList transactions={transactions} onRefresh={fetchTransactions} />
          </TabsContent>
          
          <TabsContent value="budgets" className="space-y-6 relative z-10">
            <BudgetManager />
            <BudgetComparisonChart />
          </TabsContent>
          
          <TabsContent value="insights">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Spending Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium text-blue-900">Monthly Trend</h3>
                      <p className="text-sm text-blue-700">
                        {summaryStats.monthlyExpenses > 0 
                          ? `You've spent ${formatCurrency(summaryStats.monthlyExpenses)} this month.`
                          : 'No spending recorded for this month yet.'
                        }
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-medium text-green-900">Transaction Activity</h3>
                      <p className="text-sm text-green-700">
                        You have {summaryStats.transactionCount} transactions recorded with an average of {formatCurrency(summaryStats.avgTransaction)} per transaction.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h3 className="font-medium text-orange-900">Recommendation</h3>
                      <p className="text-sm text-orange-700">
                        Set monthly budgets for better expense tracking and financial planning.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
