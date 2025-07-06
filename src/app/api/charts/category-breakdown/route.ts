import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export async function GET() {
  try {
    await connectDB();
    
    // Get current month's transactions
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const startOfMonth = new Date(currentMonth + '-01');
    const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);
    
    const transactions = await Transaction.find({
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    // Group transactions by category
    const categoryData = transactions.reduce((acc, transaction) => {
      const category = transaction.category;
      
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += transaction.amount;
      
      return acc;
    }, {} as Record<string, number>);

    // Convert to array format for pie chart
    const pieData = Object.entries(categoryData)
      .map(([category, amount]) => ({
        category,
        amount: parseFloat((amount as number).toFixed(2)),
        name: category // For recharts
      }))
      .sort((a, b) => b.amount - a.amount);

    return NextResponse.json({ pieData, totalAmount: pieData.reduce((sum, item) => sum + item.amount, 0) });
  } catch (error) {
    console.error('GET /api/charts/category-breakdown error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category breakdown data' },
      { status: 500 }
    );
  }
}
