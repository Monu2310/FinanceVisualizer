import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Budget from '@/models/Budget';
import Transaction from '@/models/Transaction';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7);
    
    // Get budgets for the month
    const budgets = await Budget.find({ month });
    
    // Get actual spending for the month
    const startOfMonth = new Date(month + '-01');
    const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);
    
    const transactions = await Transaction.find({
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    // Calculate actual spending by category
    const actualSpending = transactions.reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    // Create comparison data
    const comparisonData = budgets.map(budget => ({
      category: budget.category,
      budget: budget.amount,
      actual: actualSpending[budget.category] || 0,
      difference: budget.amount - (actualSpending[budget.category] || 0),
      percentage: actualSpending[budget.category] ? 
        ((actualSpending[budget.category] / budget.amount) * 100).toFixed(1) : '0'
    }));

    // Add categories with spending but no budget
    Object.keys(actualSpending).forEach(category => {
      if (!budgets.find(b => b.category === category)) {
        comparisonData.push({
          category,
          budget: 0,
          actual: actualSpending[category],
          difference: -actualSpending[category],
          percentage: '0'
        });
      }
    });

    return NextResponse.json({ comparisonData, month });
  } catch (error) {
    console.error('GET /api/charts/budget-comparison error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budget comparison data' },
      { status: 500 }
    );
  }
}
