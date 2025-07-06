import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export async function GET() {
  try {
    await connectDB();
    
    // Get transactions from the last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
    const transactions = await Transaction.find({
      date: { $gte: twelveMonthsAgo }
    });

    // Group transactions by month
    const monthlyData = transactions.reduce((acc, transaction) => {
      const monthKey = new Date(transaction.date).toISOString().slice(0, 7); // YYYY-MM
      
      if (!acc[monthKey]) {
        acc[monthKey] = 0;
      }
      acc[monthKey] += transaction.amount;
      
      return acc;
    }, {} as Record<string, number>);

    // Convert to array and sort by month
    const chartData = Object.entries(monthlyData)
      .map(([month, amount]) => ({
        month,
        amount: parseFloat((amount as number).toFixed(2))
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return NextResponse.json({ chartData });
  } catch (error) {
    console.error('GET /api/charts/monthly-expenses error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monthly expenses data' },
      { status: 500 }
    );
  }
}
