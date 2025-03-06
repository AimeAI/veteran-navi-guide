
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AbTestResult } from '@/types/abTest';

interface AbTestPerformanceChartProps {
  testResult: AbTestResult;
}

const AbTestPerformanceChart: React.FC<AbTestPerformanceChartProps> = ({ testResult }) => {
  // Prepare data for the chart
  const chartData = testResult.variants.map(variant => {
    const performance = testResult.performance.find(p => p.variantId === variant.id);
    return {
      name: variant.isControl ? 'Control' : `Variant ${testResult.variants.indexOf(variant)}`,
      views: performance?.views || 0,
      clicks: performance?.clicks || 0,
      applications: performance?.applications || 0,
      conversionRate: performance?.conversionRate || 0
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" domain={[0, 20]} />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="views" name="Views" fill="#8884d8" />
        <Bar yAxisId="left" dataKey="clicks" name="Clicks" fill="#82ca9d" />
        <Bar yAxisId="left" dataKey="applications" name="Applications" fill="#ffc658" />
        <Bar yAxisId="right" dataKey="conversionRate" name="Conversion Rate (%)" fill="#ff8042" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AbTestPerformanceChart;
