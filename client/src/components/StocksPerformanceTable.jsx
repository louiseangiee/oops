import React, { useState, useEffect, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Box,
  Typography,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { getAsync } from '../utils/utils';

const TableHeaderCell = ({ id, label, onRequestSort, orderDirection, orderBy }) => (
  <TableCell align="right">
    <TableSortLabel
      active={orderBy === id}
      direction={orderBy === id ? orderDirection : 'asc'}
      onClick={() => onRequestSort(id)}
      IconComponent={orderDirection === 'asc' ? ArrowUpwardIcon : ArrowDownwardIcon}
    >
      {label}
    </TableSortLabel>
  </TableCell>
);


const ReturnsTable = ({ stockData, stockReturns }) => {
  const [orderDirection, setOrderDirection] = useState('asc');
  const [orderBy, setOrderBy] = useState('percentage');
  const [cookies] = useCookies(['accessToken']);
  const [stockDetails, setStockDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockDetails = async () => {
      setLoading(true);
      setError(null);
      const details = {};
      try {
        for (const stock of stockData.portfolioStocks) {
          const responses = await Promise.all([
            getAsync(`portfolioStocks/${stockData.portfolioId}/stocks/${stock.stockSymbol}/weight`, cookies.accessToken),
            getAsync(`portfolioStocks/${stockData.portfolioId}/stocks/${stock.stockSymbol}/calculateWeightedReturn`, cookies.accessToken),
            getAsync(`portfolioStocks/${stockData.portfolioId}/stocks/${stock.stockSymbol}/calculateAnnualisedReturn`, cookies.accessToken),
          ]);
          const [weightData, weightedReturnData, annualisedReturnData] = await Promise.all(responses.map(res => res.json()));
            
          details[stock.stockSymbol] = {
            weight: weightData[stock.stockSymbol], // Assuming that API response follows the same pattern
            weightedReturn: weightedReturnData[stock.stockSymbol],
            annualisedReturn: annualisedReturnData[stock.stockSymbol],

            
          };
          
        }
        
        setStockDetails(details);
      } catch (error) {
        console.error('Failed to fetch stock details:', error);
        setError('Failed to fetch stock details');
      } finally {
        setLoading(false);
      }
    };
  
    if (stockData && stockData.portfolioStocks && stockData.portfolioStocks.length > 0) {
      fetchStockDetails();
    }
  }, [stockData, cookies.accessToken]);
  
  const sortedStockReturns = useMemo(() => {
    return Object.entries(stockReturns || {})
      .map(([symbol, data]) => ({
        symbol,
        ...data, // This spreads the return data for each stock from `stockReturns`
        ...stockDetails[symbol], // This spreads additional details fetched in `useEffect`
      }))
      .sort((a, b) => {
        const valueA = a[orderBy] ?? Number.NEGATIVE_INFINITY;
        const valueB = b[orderBy] ?? Number.NEGATIVE_INFINITY;
        return (orderDirection === 'asc' ? valueA - valueB : valueB - valueA);
      });
  }, [stockReturns, stockDetails, orderBy, orderDirection]);
  

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderBy(property);
    setOrderDirection(isAsc ? 'desc' : 'asc');
  };
  // Helper function to apply styling for negative returns
  const returnCellStyle = (value) => ({
    color: value < 0 ? 'red' : 'green',
  });

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center' }}><Typography>Loading...</Typography></Box>;
  if (error) return <Box sx={{ display: 'flex', justifyContent: 'center' }}><Typography color="error">{error}</Typography></Box>;

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Stock</TableCell>
            <TableHeaderCell
              id="weight"
              label="Weight (%)"
              onRequestSort={handleRequestSort}
              orderDirection={orderDirection}
              orderBy={orderBy}
            />
            <TableHeaderCell
              id="percentage"
              label="Return (%)"
              onRequestSort={handleRequestSort}
              orderDirection={orderDirection}
              orderBy={orderBy}
            />
            <TableCell align="right">Returns ($)</TableCell>
            <TableCell align="right">Weighted Return (%)</TableCell>
            <TableCell align="right">Annualised Return (%)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedStockReturns.map((row) => (
            
            <TableRow key={row.symbol}>
              <TableCell component="th" scope="row">{row.symbol}</TableCell>
              <TableCell align="right">{(row.weight * 100).toFixed(2)}%</TableCell>
              <TableCell style={returnCellStyle(row.percentage)} align="right">{row.percentage.toFixed(2)}%</TableCell>
              <TableCell style={returnCellStyle(row.absolute)} align="right">{row.absolute?.toFixed(2)}</TableCell>
              <TableCell align="right">{row.weightedReturn?.toFixed(2)}%</TableCell>
              <TableCell align="right">{row.annualisedReturn?.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReturnsTable;
