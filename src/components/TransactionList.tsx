'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Edit, Trash2, Plus, Calendar, Tag, IndianRupee, Sparkles } from 'lucide-react';
import { ITransaction } from '@/models/Transaction';
import { CATEGORY_COLORS } from '@/lib/constants';
import TransactionForm from './TransactionForm';

interface TransactionListProps {
  transactions: ITransaction[];
  onRefresh: () => void;
}

export default function TransactionList({ transactions, onRefresh }: TransactionListProps) {
  const [editingTransaction, setEditingTransaction] = useState<ITransaction | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddTransaction = async (transactionData: Omit<ITransaction, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
      });

      if (!response.ok) {
        throw new Error('Failed to add transaction');
      }

      setShowAddForm(false);
      onRefresh();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleEditTransaction = async (transactionData: Omit<ITransaction, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTransaction?._id) return;

    try {
      const response = await fetch(`/api/transactions/${editingTransaction._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
      });

      if (!response.ok) {
        throw new Error('Failed to update transaction');
      }

      setEditingTransaction(null);
      onRefresh();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    setIsDeleting(id);
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

      onRefresh();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <Card className="w-full backdrop-blur-sm bg-white/95 shadow-2xl border-0 ring-1 ring-gray-200/50">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full animate-ping"></div>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Transactions
            </CardTitle>
          </div>
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-gray-900">Add New Transaction</DialogTitle>
              </DialogHeader>
              <TransactionForm
                onSubmit={handleAddTransaction}
                onCancel={() => setShowAddForm(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {error && (
          <div className="px-6 pb-4">
            <Alert className="border-red-200 bg-red-50 animate-shake">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          </div>
        )}
        
        {transactions.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <IndianRupee className="w-16 h-16 text-indigo-300 mx-auto mb-4 animate-bounce" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No transactions yet</h3>
                <p className="text-gray-500 mb-4">Start tracking your finances by adding your first transaction!</p>
                <div className="flex justify-center">
                  <Button 
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Transaction
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 transition-all duration-300">
                  <TableHead className="font-semibold text-gray-700 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">Description</TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Category
                    </div>
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">
                    <div className="flex items-center justify-end gap-2">
                      <IndianRupee className="w-4 h-4" />
                      Amount
                    </div>
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction, index) => (
                  <TableRow 
                    key={transaction._id} 
                    className="group hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 border-b border-gray-100 hover:border-indigo-200 hover:shadow-md"
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      animation: 'fadeInUp 0.5s ease-out forwards'
                    }}
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="font-medium text-gray-700 group-hover:text-indigo-700 transition-colors duration-300">
                          {formatDate(transaction.date)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                        {transaction.description}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span 
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 transform group-hover:scale-105 shadow-sm"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[transaction.category as keyof typeof CATEGORY_COLORS]}20`,
                          color: CATEGORY_COLORS[transaction.category as keyof typeof CATEGORY_COLORS],
                          borderColor: `${CATEGORY_COLORS[transaction.category as keyof typeof CATEGORY_COLORS]}40`,
                          border: '1px solid'
                        }}
                      >
                        {transaction.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent group-hover:from-green-700 group-hover:to-emerald-700 transition-all duration-300">
                        {formatAmount(transaction.amount)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <Dialog open={editingTransaction?._id === transaction._id} onOpenChange={(open) => !open && setEditingTransaction(null)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingTransaction(transaction)}
                              className="hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all duration-300 transform hover:scale-110 shadow-sm hover:shadow-md"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-semibold text-gray-900">Edit Transaction</DialogTitle>
                            </DialogHeader>
                            <TransactionForm
                              transaction={editingTransaction || undefined}
                              onSubmit={handleEditTransaction}
                              onCancel={() => setEditingTransaction(null)}
                            />
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTransaction(transaction._id!)}
                          disabled={isDeleting === transaction._id}
                          className="hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-300 transform hover:scale-110 shadow-sm hover:shadow-md disabled:opacity-50"
                        >
                          <Trash2 className={`w-4 h-4 ${isDeleting === transaction._id ? 'animate-pulse' : ''}`} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </Card>
  );
}
