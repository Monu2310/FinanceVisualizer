import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Budget from '@/models/Budget';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7);
    
    const budgets = await Budget.find({ month }).sort({ category: 1 });
    return NextResponse.json({ budgets });
  } catch (error) {
    console.error('GET /api/budgets error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { category, amount, month } = body;
    
    if (!category || !amount || !month) {
      return NextResponse.json(
        { error: 'Category, amount, and month are required' },
        { status: 400 }
      );
    }

    // Use findOneAndUpdate with upsert to handle duplicates
    const budget = await Budget.findOneAndUpdate(
      { category, month },
      { amount: parseFloat(amount) },
      { new: true, upsert: true }
    );

    return NextResponse.json({ budget }, { status: 201 });
  } catch (error) {
    console.error('POST /api/budgets error:', error);
    return NextResponse.json(
      { error: 'Failed to create budget' },
      { status: 500 }
    );
  }
}
