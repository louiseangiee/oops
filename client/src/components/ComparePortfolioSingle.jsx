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
  const [cookies] = useCookies(['accessToken']);
  const [portfolioData, setPortfolioData] = useState([]);
  const [portfolioSummaries, setPortfolioSummaries] = useState([]);
  const [portfolioVolatility, setPortfolioVolatility] = useState(null);
  const [portfolioVolatilityAnnual, setPortfolioVolatilityAnnual] = useState(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const fetchPortfolio = async () => {
    try {
      if (!chosenPortfolio) {
        return;
      }  
      else{
        const response = await getAsync(`portfolios/${chosenPortfolio.portfolioId}`, cookies.accessToken);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
  
        console.log(data);

        setPortfolioData(data);
     
      }
    } catch (err) {
      console.error('There was an error fetching the portfolio details:', err);
    }
     
  };

  const fetchPortfolioSummaries = async () => {
    try {
      if (!chosenPortfolio) return;
      const response = await getAsync(`portfolioStocks/${chosenPortfolio.portfolioId}/summary`, cookies.accessToken);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      console.log(data);

      setPortfolioSummaries(data);
    } catch (err) {
      console.error('There was an error fetching the portfolio details:', err);
    }
  };

  const fetchPortfolioVolalities = async () => {
    if (!chosenPortfolio) return;
    let endpoint = `portfolioStocks/${chosenPortfolio.portfolioId}/volatility`;  // Default to monthly data
    let endpointAnnual = `portfolioStocks/${chosenPortfolio.portfolioId}/volatility/annualized`;

    try {
      const response = await getAsync(`${endpoint}`, cookies.accessToken); // Use the accessToken from cookies
      const responseAnnual = await getAsync(`${endpointAnnual}`, cookies.accessToken); // Use the accessToken from cookies

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
      const responseDataAnnual = await responseAnnual.json();

      console.log(responseData);
      console.log(responseDataAnnual);

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

  const volAnnual = toFixedSafe(portfolioVolatilityAnnual);
  const vol = toFixedSafe(portfolioVolatility);
  console.log(vol);

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

  console.log(summary);

  const overallReturn = getOverallReturn(portfolioSummaries).overalReturn;
  const overallReturnPercentage = getOverallReturn(portfolioSummaries).percentage;

  useEffect(() => {
    fetchPortfolio();
    fetchPortfolioSummaries();
    fetchPortfolioVolalities();
  }, [chosenPortfolio]);

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
                  ${portfolioData.totalCapital - portfolioData.remainingCapital}
                </Typography>
              </Box>
              <Box flex={1} margin={1}>
                <Typography mt={1} variant="h5" fontWeight="bold" fontStyle="italic" style={{ color: colors.blueAccent[400] }}>
                  Overall Returns:
                </Typography>
                <Typography variant="h3" fontWeight="bold" style={{ color: overallReturn < 0 ? colors.redAccent[300] : colors.greenAccent[300] }}>
                  {overallReturn} <span style={{ color: overallReturn < 0 ? colors.redAccent[300] : colors.greenAccent[300] }}>({overallReturnPercentage}%)</span>
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
          <ReturnsTable stockData= {portfolioData} stockReturns={summary} />
          
          
        </Box>

    
  );
};

export default ComparePortfolioSingle;