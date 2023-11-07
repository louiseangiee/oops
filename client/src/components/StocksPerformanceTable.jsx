import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useEffect } from 'react';
import { getAsync } from '../utils/utils';
import { useCookies } from 'react-cookie';

const ReturnsTable = ({ stockData, stockReturns }) => {
  const [orderDirection, setOrderDirection] = useState('asc');
  const [cookies] = useCookies(['accessToken']);

  const [stockDetails, setStockDetails] = useState({});

  const fetchStockDetails = async () => {
    const details = {};
    for (const stock of stockData) {
      try {
        // Assuming stock.symbol is the property that contains the stock's symbol
        const weightResponse = await getAsync(`/portfolioStocks/${stock.portfolioId}/stocks/${stock.symbol}/weight`, cookies.accessToken);
        const weightData = await weightResponse.json();

        const weightedReturnResponse = await getAsync(`/portfolioStocks/${stock.portfolioId}/stocks/${stock.symbol}/calculateWeightedReturn`, cookies.accessToken);
        const weightedReturnData = await weightedReturnResponse.json();

        const annualisedReturnResponse = await getAsync(`/portfolioStocks/${stock.portfolioId}/stocks/${stock.symbol}/calculateAnnualisedReturn`, cookies.accessToken);
        const annualisedReturnData = await annualisedReturnResponse.json();

        details[stock.symbol] = {
          weight: weightData,
          weightedReturn: weightedReturnData,
          annualisedReturn: annualisedReturnData
        };
      } catch (error) {
        console.error('Failed to fetch stock details:', error);
      }
    }
    setStockDetails(details);
  };

  useEffect(() => {
    if (stockData && stockData.length > 0) {
      fetchStockDetails();
    }
  }, [stockData]);


  const sortedStockReturns = useMemo(() => {
    if (!stockReturns || typeof stockReturns !== 'object' || Object.keys(stockDetails).length === 0) {
      return [];
    }
  
    const entries = Object.entries(stockReturns).map(([name, data]) => ({
      name,
      ...data,
      // Spread in additional details by matching with the stock symbol
      ...stockDetails[name]
    }));
  
    // Sorting logic
    return entries.sort((a, b) => {
      const valueA = a.percentage !== undefined ? a.percentage : Number.NEGATIVE_INFINITY; // Treat undefined as the lowest value
      const valueB = b.percentage !== undefined ? b.percentage : Number.NEGATIVE_INFINITY;
  
      if (orderDirection === 'asc') {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });
  }, [stockReturns, orderDirection, stockDetails]);
  

  const handleSortRequest = () => {
    setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
  };
  // Set the height for the visible area of the table
  const maxTableBodyHeight = 'calc(5 * 53px)'; 

  return (
    <TableContainer component={Paper} style={{ maxHeight: 'calc(5 * 53px + 52px)' }}> {/* additional height for the header */}
      <Table aria-label="simple table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Stock</TableCell>
            <TableCell align="right">Weight (%)</TableCell>
            <TableCell align="right"><TableSortLabel
              active={true} // You might want to make this dynamic if you have multiple sortable columns
              direction={orderDirection}
              onClick={() => handleSortRequest('percentage')} // Modify to handle different columns
              IconComponent={orderDirection === 'asc' ? ArrowDownwardIcon : ArrowUpwardIcon} // Icons change with direction
            >
              Return (%)
            </TableSortLabel></TableCell>
            <TableCell align="right">Returns ($)</TableCell>
            <TableCell align="right">Weighted Return (%)</TableCell>
            <TableCell align="right">Annualised Return (%)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody style={{ overflow: 'auto', maxHeight: maxTableBodyHeight }}>
          {sortedStockReturns.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">
                {row.weight ? `${(row.weight * 100).toFixed(2)}%` : 'N/A'}
              </TableCell>
              <TableCell align="right" style={{ color: row.percentage < 0 ? 'red' : 'green' }}>
                {typeof row.percentage === 'number' ? row.percentage.toFixed(2) : 'N/A'}%
              </TableCell>
              <TableCell align="right">
                {typeof row.actualValue === 'number' ? row.actualValue.toFixed(2) : 'N/A'}
              </TableCell>
              <TableCell align="right">
                {row.weightedReturn ? `${row.weightedReturn.toFixed(2)}%` : 'N/A'}
              </TableCell>
              <TableCell align="right">
                {row.annualisedReturn ? `${row.annualisedReturn.toFixed(2)}%` : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ReturnsTable;
