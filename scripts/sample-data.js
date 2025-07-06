// Sample script to add test transactions


const API_BASE = 'http://localhost:3001/api';

const sampleTransactions = [
  {
    amount: 250.50,
    description: 'Weekly groceries',
    date: new Date('2024-12-01').toISOString()
  },
  {
    amount: 45.99,
    description: 'Gas station fuel',
    date: new Date('2024-12-03').toISOString()
  },
  {
    amount: 89.00,
    description: 'Monthly gym membership',
    date: new Date('2024-12-05').toISOString()
  },
  {
    amount: 325.75,
    description: 'Electricity bill',
    date: new Date('2024-11-28').toISOString()
  },
  {
    amount: 120.00,
    description: 'Restaurant dinner',
    date: new Date('2024-12-07').toISOString()
  },
  {
    amount: 75.50,
    description: 'Online shopping',
    date: new Date('2024-11-25').toISOString()
  }
];

async function addSampleTransactions() {
  console.log('Adding sample transactions...');
  
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
        const result = await response.json();
        console.log(`✓ Added: ${transaction.description} - $${transaction.amount}`);
      } else {
        console.error(`✗ Failed to add: ${transaction.description}`);
      }
    } catch (error) {
      console.error(`✗ Error adding ${transaction.description}:`, error.message);
    }
  }
  
  console.log('Sample data loading complete!');
}


addSampleTransactions();

export { addSampleTransactions };
