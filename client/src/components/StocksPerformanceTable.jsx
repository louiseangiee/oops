import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const ReturnsTable = ({ stockReturns }) => {
  const [orderDirection, setOrderDirection] = useState('asc');

  const sortedStockReturns = useMemo(() => {
    // Ensure stockReturns is not null/undefined and is an object
    if (!stockReturns || typeof stockReturns !== 'object') {
      return [];
    }
  
    // Convert the object to an array of objects with key 'name' added
    const entries = Object.entries(stockReturns).map(([name, data]) => ({
      name,
      ...data
    }));
  
    // Now you can sort the entries array
    return entries.sort((a, b) => {
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
            <TableCell align="right">Returns</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {sortedStockReturns.map((row) => (
                <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell align="right" style={{ color: row.percentage < 0 ? 'red' : 'green' }}>
                    {typeof row.percentage === 'number' ? row.percentage.toFixed(2) : 'N/A'}%
                </TableCell>
                <TableCell align="right">
                    {typeof row.actualValue === 'number' ? row.actualValue.toFixed(2) : 'N/A'}
                </TableCell>
                </TableRow>
            ))}
        </TableBody>

      </Table>
    </TableContainer>
  );
}

export default ReturnsTable;
