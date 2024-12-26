import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, Spin } from 'antd';
import { useProvinceChartData } from '@hooks/ChartData';

const ProvinceCategoryPostChart = () => {
  const [topLimit, setTopLimit] = useState(10);
  const { provinceData, loading, error } = useProvinceChartData();

  const processedData = useMemo(() => {
    if (!provinceData || Object.keys(provinceData).length === 0) return [];

    // Sort provinces by total posts
    const sortedProvinces = Object.entries(provinceData)
      .sort(([, a], [, b]) => {
        const totalA = Object.values(a).reduce((sum, val) => sum + val, 0);
        const totalB = Object.values(b).reduce((sum, val) => sum + val, 0);
        return totalB - totalA;
      });

    // Take top N provinces based on selection
    const limitedProvinces = topLimit === 'all' 
      ? sortedProvinces 
      : sortedProvinces.slice(0, topLimit);

    // Transform data for Recharts
    return limitedProvinces.map(([province, categories]) => ({
      province,
      ...categories
    }));
  }, [provinceData, topLimit]);

  if (loading) {
    return (
      <div style={{ width: '100%', height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: '100%', height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'red' }}>
        Error loading data: {error.message}
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Select
          defaultValue={10}
          style={{ width: 120 }}
          onChange={setTopLimit}
          options={[
            { value: 10, label: 'Top 10' },
            { value: 15, label: 'Top 15' },
            { value: 20, label: 'Top 20' },
            { value: 25, label: 'Top 25' },
            { value: 'all', label: 'Tất cả tỉnh thành' }
          ]}
        />
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={processedData}
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="province" type="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(processedData[0] || {})
            .filter(key => key !== 'province')
            .map((category, index) => (
              <Line
                key={category}
                type="monotone"
                dataKey={category}
                name={category}
                stroke={`hsl(${index * 45}, 70%, 50%)`}
                strokeWidth={2}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProvinceCategoryPostChart;