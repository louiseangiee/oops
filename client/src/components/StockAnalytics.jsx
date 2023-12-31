import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import PortfolioBreakdown from './UserPortfoliosBreakdown';
import ReturnsTable from './StocksPerformanceTable';
import { useCookies } from "react-cookie";
import { getAsync } from '../utils/utils';
import { useTheme } from '@mui/material/styles';
import { tokens } from "../theme";

// Assume that the following functions and components are shared and can be imported as needed:
// CustomTooltip, toFixedSafe, getOverallReturn, getStockReturns, fetchAllEndpoints

const StockAnalytics = ({ portfolioData, portfolioSummaries }) => {
  const [cookies] = useCookies();
  const [portfolioVolatility, setPortfolioVolatility] = useState(null);
  const [portfolioVolatilityAnnual, setPortfolioVolatilityAnnual] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loadingTable, setLoadingTable] = useState(true);


  const handleLoadingState = (isLoading) => {
    setLoadingTable(isLoading);
  };

  const fetchPortfolioVolalities = async () => {
    let endpoint = `portfolioStocks/${portfolioData.portfolioId}/volatility`;  // Default to monthly data
    let endpointAnnual = `portfolioStocks/${portfolioData.portfolioId}/volatility/annualized`;

    try {
      const response = await getAsync(`${endpoint}`, cookies.accessToken); // Use the accessToken from cookies
      const responseAnnual = await getAsync(`${endpointAnnual}`, cookies.accessToken); // Use the accessToken from cookies

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
      const responseDataAnnual = await responseAnnual.json();

      setPortfolioVolatility(responseData.portfolioVolatility);
      setPortfolioVolatilityAnnual(responseDataAnnual.portfolioVolatility);
    } catch (error) {
      console.error('There was an error fetching the portfolio details:', error);
    }
  };

  function toFixedSafe(value, digits = 2, defaultValue = 'N/A') {
    try {
      const number = Number(value);
      if (Number.isFinite(number)) {
        return number.toFixed(digits);
      } else {
        throw new Error('Value is not a finite number');
      }
    } catch (error) {
      console.error(error);
      return defaultValue;
    }
  }

  var volAnnual = null;
  var vol = null;
  if (portfolioVolatilityAnnual) {
    volAnnual = toFixedSafe(portfolioVolatilityAnnual);
  }

  if (portfolioVolatility) {
    vol = toFixedSafe(portfolioVolatility);
  }

  function getOverallReturn(portfolioSummaries) {
    if (!portfolioSummaries) {
      console.error("Error: portfolioSummaries is not defined.");
      return '';
    }
    if (!portfolioSummaries.overallReturns) {
      console.error("Error: overallReturn is not defined in the portfolioSummaries object.");
      return '';
    }
    return portfolioSummaries.overallReturns;
  }

  function getStockReturns(portfolioSummaries) {
    if (!portfolioSummaries) {
      console.error("Error: portfolioSummaries is not defined.");
      return '';
    }

    if (!portfolioSummaries.stockReturns) {
      console.error("Error: stockReturns is not defined in the portfolioSummaries object.");
      return '';
    }
    return portfolioSummaries.stockReturns;
  }

  const summary = getStockReturns(portfolioSummaries);

  const overallReturn = getOverallReturn(portfolioSummaries).overalReturn;
  const overallReturnPercentage = getOverallReturn(portfolioSummaries).percentage;

  useEffect(() => {
    fetchPortfolioVolalities();
  }, [portfolioData.portfolioId]);

  return (
    <Box flex={1} margin={2} padding={3} style={{ backgroundColor: colors.primary[400] }} borderLeft={3}>
      <Typography variant="h2" fontWeight="bold" fontStyle="italic" style={{ color: colors.greenAccent[400] }}>
        ID {portfolioData.portfolioId}: {portfolioData.name}
      </Typography>
      <Typography mt={2} variant="h4" fontWeight="bold">
        Portfolio Description:
      </Typography>
      <Typography mt={1} variant="h5" fontStyle="italic">
        {portfolioData.description}
      </Typography>



      {/* Include description for portfolioData2 here */}
      <Box display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%">
        <Box flex={1} margin={1}>
          <Box flex={1} margin={1}>
            <Typography mt={1} variant="h5" fontWeight="bold" fontStyle="italic" style={{ color: colors.blueAccent[400] }}>
              Total Portfolio Value:
            </Typography>
            <Typography variant="h3" fontWeight="bold">
              ${(portfolioData.totalCapital - portfolioData.remainingCapital).toFixed(2)}
            </Typography>
          </Box>
          <Box flex={1} margin={1}>
            <Typography mt={1} variant="h5" fontWeight="bold" fontStyle="italic" style={{ color: colors.blueAccent[400] }}>
              Overall Returns:
            </Typography>
            <Typography variant="h3" fontWeight="bold" style={{ color: overallReturn < 0 ? colors.redAccent[300] : colors.greenAccent[300] }}>
              {overallReturn}({overallReturnPercentage}%)
            </Typography>
          </Box>
        </Box>
        <Box flex={1} margin={1}>
          <Box flex={1} margin={1}>
            <Typography mt={1} variant="h5" fontWeight="bold" fontStyle="italic" style={{ color: colors.blueAccent[400] }}>
              Remaining Capital:
            </Typography>
            <Typography variant="h3" fontWeight="bold">
              ${portfolioData.remainingCapital}
            </Typography>
            <Box flex={1}>
              <Typography mt={1} variant="h5" fontWeight="bold" fontStyle="italic" style={{ color: colors.blueAccent[400] }}>
                Capital Allocation:
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                ${portfolioData.totalCapital}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box flex={1} margin={1}>
          <Box flex={1} margin={1}>
            <Typography mt={1} variant="h5" fontWeight="bold" fontStyle="italic" style={{ color: colors.blueAccent[400] }}>
              Volatility (Monthly):
            </Typography>
            <Typography variant="h3" fontWeight="bold">
              {(vol * 100).toFixed(2)}%
            </Typography>
          </Box>
          <Box flex={1} margin={1}>
            <Typography mt={1} variant="h5" fontWeight="bold" fontStyle="italic" style={{ color: colors.blueAccent[400] }}>
              Volatility Annualized:
            </Typography>
            <Typography variant="h3" fontWeight="bold">
              {(volAnnual * 100).toFixed(2)}%
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider />
      <br />
      <PortfolioBreakdown portfolioStockData={portfolioData.portfolioStocks} />
      <br />
      <Divider />
      <br />
      <ReturnsTable stockData={portfolioData} stockReturns={summary} onLoading={handleLoadingState} />
    </Box>
  );
};

export default StockAnalytics;