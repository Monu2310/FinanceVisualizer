import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find({}).sort({ date: -1 });
    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('GET /api/transactions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { amount, description, date, category } = body;
    
    if (!amount || !description || !date || !category) {
      return NextResponse.json(
        { error: 'Amount, description, date, and category are required' },
        { status: 400 }
      );
    }

    const transaction = new Transaction({
      amount: parseFloat(amount),
      description,
      date: new Date(date),
      category
    });

    await transaction.save();
    
    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error) {
    console.error('POST /api/transactions error:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
