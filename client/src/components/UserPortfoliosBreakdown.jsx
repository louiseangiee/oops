import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Paper, Select, MenuItem, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { tokens } from '../theme';
import BreakdownTable from './PortfolioBreakdownTable';

const COLORS = ['#0088FE', '#FF5D73', '#FFC658', '#00C49F', '#AF19FF', '#FFBB28'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc', color: 'black' }}>
        <p className="label">{`${data.name}: $${data.value.toFixed(2)}`}</p>
      </div>
    );
  }

  return null;
};

const groupDataBy = (data, key) => {
  if (!Array.isArray(data)) {
    console.error('Invalid data: expected an array, received ', data);
    return [];
  }

  return data.reduce((res, item) => {
    if (!item || !Object.prototype.hasOwnProperty.call(item, key)) {
      return res;
    }
    const groupValue = item[key];
    if (!res[groupValue]) {
      res[groupValue] = { name: groupValue || 'Unknown', value: 0 };
    }
    res[groupValue].value += (item.quantity || 0) * (item.buyPrice || 0);
    return res;
  }, {});
};

const PortfolioBreakdown = ({ portfolioStockData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [grouping, setGrouping] = useState('stockSector');

  useEffect(() => {
    if (!portfolioStockData || portfolioStockData.length === 0) {
      console.error('Portfolio data is empty.');
      return;
    }

    if (!portfolioStockData[0][grouping]) {
      setGrouping('stockSector');
    }
  }, [portfolioStockData, grouping]);

  if (!portfolioStockData || portfolioStockData.length === 0) {
    return <Typography variant="h4">Portfolio Data Loading..</Typography>;
  }

  const transformedData = Object.values(groupDataBy(portfolioStockData, grouping))
    .sort((a, b) => b.value - a.value);

  const totalPortfolioValue = transformedData.reduce((total, current) => total + current.value, 0);

  const groupLabel = grouping
    ? grouping.charAt(0).toUpperCase() + grouping.slice(1).replace(/([A-Z])/g, ' $1').trim()
    : '';

  return (
    <Paper style={{ padding: '20px' }}>
      <Typography variant="h4" align="center" fontWeight="bold" style={{ color: colors.greenAccent[400] }}>
        Overall Portfolio Breakdown
      </Typography>
      <Select
        value={grouping}
        onChange={(event) => setGrouping(event.target.value)}
        style={{ marginBottom: '20px' }}
      >
        <MenuItem value="stockSector">Sector</MenuItem>
        <MenuItem value="stockIndustry">Industry</MenuItem>
      </Select>
      <ResponsiveContainer height={400}>
        <PieChart>
          <Pie
            data={transformedData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            labelLine={false}
          >
            {transformedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <BreakdownTable data={transformedData} totalValue={totalPortfolioValue} />
    </Paper>
  );
};

export default PortfolioBreakdown;
