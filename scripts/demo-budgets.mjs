#!/usr/bin/env node


const API_BASE = 'http://localhost:3000/api';

const currentMonth = new Date().toISOString().slice(0, 7);

const sampleBudgets = [
  {
    category: 'Food & Dining',
    amount: 5000,
    month: currentMonth
  },
  {
    category: 'Groceries',
    amount: 8000,
    month: currentMonth
  },
  {
    category: 'Transportation',
    amount: 3000,
    month: currentMonth
  },
  {
    category: 'Shopping',
    amount: 10000,
    month: currentMonth
  },
  {
    category: 'Bills & Utilities',
    amount: 6000,
    month: currentMonth
  },
  {
    category: 'Entertainment',
    amount: 2000,
    month: currentMonth
  },
  {
    category: 'Health & Medical',
    amount: 4000,
    month: currentMonth
  },
  {
    category: 'Education',
    amount: 5000,
    month: currentMonth
  },
  {
    category: 'Travel',
    amount: 8000,
    month: currentMonth
  }
];

async function addSampleBudgets() {
  console.log('💰 Adding sample budgets...\n');
  
  for (const budget of sampleBudgets) {
    try {
      const response = await fetch(`${API_BASE}/budgets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(budget),
      });
      
      if (response.ok) {
        console.log(`✅ Added budget: ${budget.category} - $${budget.amount}`);
      } else {
        const error = await response.json();
        console.error(`❌ Failed to add budget: ${budget.category} - ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(`❌ Error adding budget ${budget.category}:`, error.message);
    }
  }
  
  console.log('\n🎉 Sample budget data loading complete!');
  console.log('💡 Visit http://localhost:3000 and go to the Budgets tab to see your budgets');
}

// Run the script
addSampleBudgets();
