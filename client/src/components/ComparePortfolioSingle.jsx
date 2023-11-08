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

const ComparePortfolioSingle = ({ chosenPortfolio }) => {
  const [cookies] = useCookies();
  const [portfolioData, setPortfolioData] = useState([]);
  const [overallReturn, setOverallReturn] = useState(0);
  const [overallReturnPercentage, setOverallReturnPercentage] = useState(0);
  const [volatility, setVolatility] = useState(0);
  const [volatilityAnnual, setVolatilityAnnual] = useState(0);
  const [stockReturns, setStockReturns] = useState({});

  // loading states for different endpoints
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingVolatility, setLoadingVolatility] = useState(true);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  function toFixedSafe(value, digits = 2, defaultValue = 'N/A') {
    if (value == null) return;
    try {
      const number = Number(value);
      if (!isNaN(number) && Number.isFinite(number)) {
        return number.toFixed(digits);
      }
    } catch (error) {
      console.error(error);
      return defaultValue;
    }
  }

  const fetchPortfolio = async () => {
    try {
      if (!chosenPortfolio || chosenPortfolio.portfolioId === undefined) {
        return;
      }
      else {
        const response = await getAsync(`portfolios/${chosenPortfolio.portfolioId}`, cookies.accessToken);
        if (!response.ok) {
          setLoadingPortfolio(false);
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPortfolioData(data);
        setLoadingPortfolio(false);

      }
    } catch (err) {
      console.error('There was an error fetching the portfolio details:', err);
      setLoadingPortfolio(false);
    }
    setLoadingPortfolio(false);
  };

  const fetchPortfolioSummaries = async () => {
    try {
      if (!chosenPortfolio || chosenPortfolio.portfolioId === undefined) return;
      const response = await getAsync(`portfolioStocks/${chosenPortfolio.portfolioId}/summary`, cookies.accessToken);
      if (!response.ok) {
        setLoadingSummary(false);
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setOverallReturn(data?.overallReturns?.overallReturn ? data.overallReturns.overallReturn : 0);
      setOverallReturnPercentage(data?.overallReturns?.percentage ? data.overallReturns.percentage : 0);
      setStockReturns(data?.stockReturns ? data.stockReturns : {});
      setLoadingSummary(false);
    } catch (err) {
      console.error('There was an error fetching the portfolio details:', err);
      setLoadingSummary(false);
    }
    setLoadingSummary(false);
  };

  const fetchPortfolioVolalities = async () => {
    if (!chosenPortfolio || chosenPortfolio.portfolioId === undefined) return;
    let endpoint = `portfolioStocks/${chosenPortfolio.portfolioId}/volatility`;
    let endpointAnnual = `portfolioStocks/${chosenPortfolio.portfolioId}/volatility/annualized`;

    try {
      const response = await getAsync(`${endpoint}`, cookies.accessToken);
      const responseAnnual = await getAsync(`${endpointAnnual}`, cookies.accessToken); // Use the accessToken from cookies

      if (!response.ok) {
        setLoadingVolatility(false);
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
      const responseDataAnnual = await responseAnnual.json();

      setVolatility(toFixedSafe(responseData.portfolioVolatility));
      setVolatilityAnnual(toFixedSafe(responseDataAnnual.portfolioVolatility));
      setLoadingVolatility(false);
    } catch (error) {
      console.error('There was an error fetching the portfolio details:', error);
      setLoadingVolatility(false);
    }
    setLoadingVolatility(false);
  };

  useEffect(() => {
    fetchPortfolio();
    fetchPortfolioSummaries();
    fetchPortfolioVolalities();
  }, [chosenPortfolio]);


  return (
    <Box flex={1} margin={2} padding={3} style={{ backgroundColor: colors.primary[400] }} borderLeft={3}>
      {loadingPortfolio ? 'Loading...' : (
        <>
          <Typography variant="h2" fontWeight="bold" fontStyle="italic" style={{ color: colors.greenAccent[400] }}>
            ID {portfolioData.portfolioId}: {portfolioData.name}
          </Typography>
          <Typography mt={2} variant="h4" fontWeight="bold">
            Portfolio Description:
          </Typography>
          <Typography mt={1} variant="h5" fontStyle="italic">
            {portfolioData.description}
          </Typography>

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
                  {loadingSummary ? 'Calculating data...' :
                    `$ ${overallReturn}(${overallReturnPercentage}%)`
                  }
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
                  {loadingVolatility ? 'Calculating data...' :
                    (volatility * 100).toFixed(2) + '%'
                  }

                </Typography>
              </Box>
              <Box flex={1} margin={1}>
                <Typography mt={1} variant="h5" fontWeight="bold" fontStyle="italic" style={{ color: colors.blueAccent[400] }}>
                  Volatility Annualized:
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  {loadingVolatility ? 'Calculating data...' :
                    (volatilityAnnual * 100).toFixed(2) + '%'
                  }
                </Typography>
              </Box>
            </Box>
          </Box>
        </>)}
      <Divider />
      <br />
      <PortfolioBreakdown portfolioStockData={portfolioData.portfolioStocks} />
      <br />
      <Divider />
      <br />
      <ReturnsTable stockData={portfolioData} stockReturns={stockReturns} />


    </Box>
  );
};

export default ComparePortfolioSingle;