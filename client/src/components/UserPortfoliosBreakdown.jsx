import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { ButtonGroup, Button, Typography, Paper } from '@mui/material';
import { tokens } from "../theme";
import { getAsync } from '../utils/utils';
import { useCookies } from "react-cookie";
import { Treemap,  Tooltip, ResponsiveContainer } from 'recharts';


const Dummydata = [
    { name: 'Group A', value: 2000 },
    { name: 'Group B', value: 1000 },
    { name: 'Group C', value: 5000 },
    { name: 'Group D', value: 1000 },
    { name: 'Group E', value: 1500 },
    { name: 'Group F', value: 500 },
  ].sort((a, b) => b.value - a.value); // Sort data from biggest to smallest
  
  const COLORS = ['#0088FE', '#FF5D73', '#FFC658', '#00C49F', '#AF19FF', '#FFBB28'];
  
  const TreemapCustomizedContent = ({ x, y, width, height, index, colors, name, value }) => {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: colors[index % colors.length],
            stroke: '#fff',
            strokeWidth: 2,
          }}
        />
        <text
          x={x + width / 2}
          y={y + height / 2 - 10}
          fill="#fff"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="1.2em"
        >
          {name}
        </text>
        <text
          x={x + width / 2}
          y={y + height / 2 + 10}
          fill="#fff"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          ${value}
        </text>
      </g>
    );
  };
  
  const PortfolioBreakdown = () => {
    return (
      <Paper style={{ padding: '20px' }}>
        <Typography variant="h4" align="center">
          Overall Portfolio Breakdown
        </Typography>
  
        <ResponsiveContainer width="100%" height={300}>
          <Treemap
            data={Dummydata}
            dataKey="value"
            ratio={4 / 3}
            stroke="#fff"
            content={<TreemapCustomizedContent colors={COLORS} />}
          />
        </ResponsiveContainer>
  
        
      </Paper>
    );
  }
  
  export default PortfolioBreakdown;