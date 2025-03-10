
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function ApplicationStatusChart() {
  // Mock data for the chart
  const data = [
    { name: 'Under Review', value: 15, color: '#FCD34D' },
    { name: 'Screening', value: 10, color: '#60A5FA' },
    { name: 'Interview', value: 8, color: '#A78BFA' },
    { name: 'Offered', value: 5, color: '#818CF8' },
    { name: 'Hired', value: 3, color: '#34D399' },
    { name: 'Rejected', value: 7, color: '#F87171' },
  ];
  
  const COLORS = data.map(item => item.color);
  
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip formatter={(value) => [`${value} applications`, 'Count']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
