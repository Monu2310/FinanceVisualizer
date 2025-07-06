# Personal Finance Visualizer

A comprehensive, modern web application for tracking personal finances with advanced budgeting and visualization features. Built with Next.js, React, and TypeScript.

## 🚀 Features

### ✅ Stage 1: Basic Transaction Tracking

- ✅ Add, edit, and delete transactions
- ✅ Transaction form with validation (amount, date, description)
- ✅ Transaction list view with responsive design
- ✅ Monthly expenses bar chart using Recharts
- ✅ Error states and loading states

### ✅ Stage 2: Categories

- ✅ Predefined categories for transactions
- ✅ Category-wise pie chart visualization
- ✅ Dashboard with summary cards
- ✅ Total expenses and category breakdown
- ✅ Enhanced transaction management

### ✅ Stage 3: Budgeting

- ✅ Set monthly category budgets
- ✅ Budget vs actual comparison chart
- ✅ Spending insights and recommendations
- ✅ Budget utilization tracking
- ✅ Financial health indicators

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Charts**: Recharts for data visualization
- **Database**: MongoDB with Mongoose
- **Icons**: Lucide React icons

## 📊 Dashboard Features

### Overview Tab

- Monthly expenses trend chart
- Category spending pie chart
- Key financial metrics

### Transactions Tab

- Complete transaction management
- Category-based organization
- Real-time updates

### Budgets Tab

- Budget creation and management
- Visual budget vs actual comparison
- Monthly budget tracking

### Insights Tab

- Spending pattern analysis
- Financial recommendations
- Budget optimization tips

### Dashboard Navigation

Navigate between four main sections:

- **Overview**: Visual charts and summary metrics
- **Transactions**: Manage your financial transactions
- **Budgets**: Set and track monthly budgets
- **Insights**: View spending analysis and recommendations

### Adding Transactions

1. Go to the "Transactions" tab
2. Click the "Add Transaction" button
3. Fill in amount, description, date, and category
4. Click "Add Transaction" to save

### Setting Budgets

1. Go to the "Budgets" tab
2. Select a category and enter budget amount
3. Click "Add Budget" to set monthly limits
4. View budget vs actual spending in the comparison chart

### Viewing Analytics

- **Monthly Trends**: Bar chart showing spending over time
- **Category Breakdown**: Pie chart of current month spending
- **Budget Analysis**: Compare planned vs actual spending
- **Financial Insights**: Get recommendations and insights

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── transactions/           # Transaction CRUD operations
│   │   ├── budgets/               # Budget management
│   │   └── charts/                # Data for visualizations
│   ├── globals.css
│   └── page.tsx
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── TransactionForm.tsx        # Add/Edit transaction form
│   ├── TransactionList.tsx        # Transaction management
│   ├── MonthlyExpensesChart.tsx    # Monthly spending trends
│   ├── CategoryPieChart.tsx       # Category breakdown
│   ├── BudgetManager.tsx          # Budget creation/management
│   ├── BudgetComparisonChart.tsx  # Budget vs actual analysis
│   ├── Dashboard.tsx              # Main dashboard interface
│   └── ErrorBoundary.tsx          # Error handling
├── lib/
│   ├── mongodb.ts                 # Database connection
│   ├── constants.ts               # Categories and colors
│   └── utils.ts                   # Utility functions
├── models/
│   ├── Transaction.ts             # Transaction schema
│   └── Budget.ts                  # Budget schema
└── types/
    └── global.d.ts
```

## Development

The application follows modern React patterns with:

- Client-side rendering for interactive components
- Server-side API routes for data management
- Responsive design with mobile-first approach
- Form validation and error handling
- TypeScript for type safety

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
