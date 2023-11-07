import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Paper, Select, MenuItem, Typography } from '@mui/material';
import { Treemap, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { tokens } from '../theme';
import BreakdownTable from './PortfolioBreakdownTable';

const COLORPALETTE = ['#0088FE', '#FF5D73', '#FFC658', '#00C49F', '#AF19FF', '#FFBB28'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc', color: 'black' }}>
        <p className="label">{`$${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }

  return null;
};

const TreemapCustomizedContent = ({
  x, y, width, height, index, colors, name, minSize = 80
}) => {
  const adjustedWidth = Math.max(width, minSize);
  const adjustedHeight = Math.max(height, minSize);

  const adjustedX = width < minSize ? x - ((minSize - width) / 2) : x;
  const adjustedY = height < minSize ? y - ((minSize - height) / 2) : y;

  const validName = typeof name === 'string' ? name : 'N/A';
  const displayLabel = adjustedWidth > 60 && adjustedHeight > 20 && validName;
  
  
  // Split the label into words
  const words = validName.split(' ');
  let displayText1 = '';
  let displayText2 = '';

  // Attempt to split the label into two lines if it's too long
  if (displayLabel && words.length) {
    let testText = '';
    for (let word of words) {
      // Check if adding the next word would make it too wide
      if (testText.length && (testText.length + word.length) * 6 > adjustedWidth) {
        if (!displayText1.length) {
          displayText1 = testText.trim();
          testText = '';
        } else if (!displayText2.length) {
          displayText2 = testText.trim();
          break;
        }
      }
      testText += `${word} `;
    }
    // If there's remaining text, add it to the second line, or to the first if it's empty
    if (testText.length) {
      if (!displayText1.length) {
        displayText1 = testText.trim();
      } else if (!displayText2.length) {
        displayText2 = testText.trim();
      }
    }
  }

  return (
    <g>
      <rect
        x={adjustedX}
        y={adjustedY}
        width={adjustedWidth}
        height={adjustedHeight}
        style={{
          fill: colors[index % colors.length],
          stroke: '#fff',
          strokeWidth: 2,
        }}
      />
      {displayLabel && (
        <>
          <text
            x={adjustedX + (adjustedWidth / 2)}
            y={adjustedY + (adjustedHeight / 2) - 10} // Adjust y position for the first line
            fill="#fff"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="0.9em"
            pointerEvents="none"
          >
            {displayText1}
          </text>
          {displayText2 && (
            <text
              x={adjustedX + (adjustedWidth / 2)}
              y={adjustedY + (adjustedHeight / 2) + 10} // Adjust y position for the second line
              fill="#fff"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="0.9em"
              pointerEvents="none"
            >
              {displayText2}
            </text>
          )}
        </>
      )}
    </g>
  );
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
    if (portfolioStockData && portfolioStockData.length > 0 && !portfolioStockData[0][grouping]) {
      setGrouping('stockSector');
    }
  }, [portfolioStockData, grouping]);

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
      <ResponsiveContainer height={200}>
        <Treemap
          data={transformedData}
          dataKey="value"
          ratio={3 / 4}
          stroke="#fff"
          content={<TreemapCustomizedContent colors={COLORPALETTE} />}
        >
          <Tooltip content={<CustomTooltip />} />
          
        </Treemap>

        <BreakdownTable data={transformedData} totalValue={totalPortfolioValue} />
      </ResponsiveContainer>

    </Paper>
  );
};

export default PortfolioBreakdown;
