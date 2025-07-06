'use client';

import { useEffect, useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BudgetComparisonData {
  category: string;
  budget: number;
  actual: number;
  difference: number;
  percentage: string;
}

export default function BudgetComparisonChart() {
  const [data, setData] = useState<BudgetComparisonData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/charts/budget-comparison?month=${selectedMonth}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch budget comparison data');
      }
      
      const result = await response.json();
      setData(result.comparisonData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(value);
  };

  const formatTooltip = (value: number, name: string) => {
    return [formatCurrency(value), name === 'budget' ? 'Budget' : 'Actual'];
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Budget vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">Loading budget comparison...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Budget vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Budget vs Actual</CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="month">Month:</Label>
            <Input
              id="month"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-40"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">No budget data available for this month.</p>
          </div>
        ) : (
          <>
            <div className="h-80 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="category" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip formatter={formatTooltip} />
                  <Legend />
                  <Bar dataKey="budget" fill="#8884d8" name="Budget" />
                  <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Summary Table */}
            <div className="space-y-2">
              <h3 className="font-semibold">Budget Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((item) => (
                  <Card key={item.category} className={`p-4 ${item.difference < 0 ? 'border-red-200' : 'border-green-200'}`}>
                    <div className="space-y-2">
                      <h4 className="font-medium">{item.category}</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Budget:</span>
                          <span className="font-medium">{formatCurrency(item.budget)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Actual:</span>
                          <span className="font-medium">{formatCurrency(item.actual)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Difference:</span>
                          <span className={`font-medium ${item.difference < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatCurrency(item.difference)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Used:</span>
                          <span className="font-medium">{item.percentage}%</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
