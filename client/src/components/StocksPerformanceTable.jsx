import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const ReturnsTable = ({ stockReturns }) => {
  const [orderDirection, setOrderDirection] = useState('asc');

  const sortedStockReturns = useMemo(() => {
    // Convert stockReturns object into an array and sort
    const returnsArray = Object.entries(stockReturns).map(([key, value]) => ({
      name: key,
      percentage: value.percentage,
      actualValue: value.actualValue
    }));
    return returnsArray.sort((a, b) => {
      if (orderDirection === 'asc') {
        return a.percentage - b.percentage;
      } else {
        return b.percentage - a.percentage;
      }
    });
  }, [stockReturns, orderDirection]);

  const handleSortRequest = () => {
    setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Stock</TableCell>
            <TableCell align="right">
              <TableSortLabel
                active
                direction={orderDirection}
                onClick={handleSortRequest}
                IconComponent={orderDirection === 'asc' ? ArrowUpwardIcon : ArrowDownwardIcon}
              >
                Return (%)
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedStockReturns.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right" style={{ color: row.percentage < 0 ? 'red' : 'green' }}>
                {row.percentage.toFixed(2)}%
              </TableCell>
              <TableCell align="right">{row.actualValue.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ReturnsTable;
