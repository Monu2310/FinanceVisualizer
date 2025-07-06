export const CATEGORIES = [
  'Food & Dining',
  'Groceries',
  'Transportation',
  'Bills & Utilities',
  'Entertainment',
  'Health & Medical',
  'Education',
  'Shopping',
  'Travel',
  'Other'
] as const;

export type Category = typeof CATEGORIES[number];

export const CATEGORY_COLORS = {
  'Food & Dining': '#8884d8',
  'Groceries': '#82ca9d',
  'Transportation': '#ffc658',
  'Bills & Utilities': '#ff7300',
  'Entertainment': '#00c49f',
  'Health & Medical': '#0088fe',
  'Education': '#ff8042',
  'Shopping': '#8dd1e1',
  'Travel': '#00c49f',
  'Other': '#d084d0'
} as const;
