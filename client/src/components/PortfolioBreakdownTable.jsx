import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const BreakdownTable = ({ data, totalValue }) => {
  // Define a style for the TableContainer to make it scrollable
  const scrollableStyle = {
    maxHeight: '400px', // Adjust the height as needed
    overflow: 'auto'
  };

  return (
    <TableContainer component={Paper} style={scrollableStyle}>
      <Table stickyHeader aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Percentage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">
                {((row.value / totalValue) * 100).toFixed(2)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BreakdownTable;
