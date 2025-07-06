#!/usr/bin/env node


const API_BASE = 'http://localhost:3000/api';

const sampleTransactions = [
  {
    amount: 2500,
    description: 'Monthly groceries from Big Bazaar',
    date: '2024-12-01T10:00:00.000Z',
    category: 'Groceries'
  },
  {
    amount: 1200,
    description: 'Petrol fill-up',
    date: '2024-12-03T15:30:00.000Z',
    category: 'Transportation'
  },
  {
    amount: 1500,
    description: 'Monthly gym membership',
    date: '2024-12-05T09:00:00.000Z',
    category: 'Health & Medical'
  },
  {
    amount: 3500,
    description: 'Electricity bill',
    date: '2024-11-28T14:00:00.000Z',
    category: 'Bills & Utilities'
  },
  {
    amount: 800,
    description: 'Dinner at restaurant',
    date: '2024-12-07T19:30:00.000Z',
    category: 'Food & Dining'
  },
  {
    amount: 2200,
    description: 'Online shopping - Amazon',
    date: '2024-11-25T16:45:00.000Z',
    category: 'Shopping'
  },
  {
    amount: 450,
    description: 'Auto rickshaw rides',
    date: '2024-12-01T08:00:00.000Z',
    category: 'Transportation'
  },
  {
    amount: 350,
    description: 'Chai and snacks',
    date: '2024-12-10T09:15:00.000Z',
    category: 'Food & Dining'
  },
  {
    amount: 15000,
    description: 'New smartphone',
    date: '2024-12-12T14:30:00.000Z',
    category: 'Shopping'
  },
  {
    amount: 600,
    description: 'Movie tickets - PVR',
    date: '2024-12-15T18:00:00.000Z',
    category: 'Entertainment'
  },
  {
    amount: 5000,
    description: 'Online course fee',
    date: '2024-11-20T10:00:00.000Z',
    category: 'Education'
  },
  {
    amount: 2000,
    description: 'Doctor consultation',
    date: '2024-11-18T15:00:00.000Z',
    category: 'Health & Medical'
  },
  {
    amount: 1800,
    description: 'Mobile recharge',
    date: '2024-12-08T12:00:00.000Z',
    category: 'Bills & Utilities'
  },
  {
    amount: 12000,
    description: 'Train ticket to Mumbai',
    date: '2024-11-15T08:00:00.000Z',
    category: 'Travel'
  }
];

async function addSampleTransactions() {
  console.log('🚀 Adding sample transactions...\n');
  
  for (const transaction of sampleTransactions) {
    try {
      const response = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });
      
      if (response.ok) {
        console.log(`✅ Added: ${transaction.description} - $${transaction.amount} (${transaction.category})`);
      } else {
        const error = await response.json();
        console.error(`❌ Failed to add: ${transaction.description} - ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(`❌ Error adding ${transaction.description}:`, error.message);
    }
  }
  
  console.log('\n🎉 Sample data loading complete!');
  console.log('💡 Visit http://localhost:3000 to see your transactions');
}


addSampleTransactions();
