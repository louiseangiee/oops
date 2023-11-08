import React, { useState, useEffect } from 'react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';
import { useCookies } from "react-cookie";
import { getAsync } from '../utils/utils';
import { Typography, Box, Table, Divider } from '@mui/material';
import { tokens } from "../theme";
import PortfolioBreakdown from './UserPortfoliosBreakdown';
import ReturnsTable from './StocksPerformanceTable';
import { fetchAllEndpoints } from '../utils/utils';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc', color: "black" }}>
        <p className="label">{`Date: ${label}`}</p>
        <p className="value">{`Value: $${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }

  return null;
};

const ComparePortfolioChart = ({ chosenPortfolio1, chosenPortfolio2 }) => {
  const [cookies] = useCookies(['accessToken']);
  const [portfolioData1, setPortfolioData1] = useState([]);
  const [portfolioData2, setPortfolioData2] = useState([]);

  const [portfolioSummaries1, setPortfolioSummaries1] = useState([]);
  const [portfolioSummaries2, setPortfolioSummaries2] = useState([]);

  const [portfolioVolatility1, setPortfolioVolatility1] = useState(null);
  const [portfolioVolatility2, setPortfolioVolatility2] = useState(null);
  const [portfolioVolatility1Annual, setPortfolioVolatility1Annual] = useState(null);
  const [portfolioVolatility2Annual, setPortfolioVolatility2Annual] = useState(null);

  const [chartData, setChartData] = useState([]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Fetch data for both portfolios
  const fetchOverallPortfolio = async () => {
    try {
      if (!chosenPortfolio1 || !chosenPortfolio2) {
        return;
      }  
      else{
        const response1 = await getAsync(`portfolios/${chosenPortfolio1.portfolioId}`, cookies.accessToken);
        const response2 = await getAsync(`portfolios/${chosenPortfolio2.portfolioId}`, cookies.accessToken);
        if (!response1.ok || !response2.ok) {
          throw new Error('Network response was not ok');
        }
        const data1 = await response1.json();
        const data2 = await response2.json();
  
        console.log(data1);
        console.log(data2);
  
        setPortfolioData1(data1);
        setPortfolioData2(data2);
     
      }
    } catch (err) {
      console.error('There was an error fetching the portfolio details:', err);
    }
     
  };

  

  const fetchPortfolioSummaries = async () => {
    try {
      if (!chosenPortfolio1 || !chosenPortfolio2){
        return;
      }
      else{
        const response1 = await getAsync(`portfolioStocks/${chosenPortfolio1.portfolioId}/summary`, cookies.accessToken);
        const response2 = await getAsync(`portfolioStocks/${chosenPortfolio2.portfolioId}/summary`, cookies.accessToken);
        if (!response1.ok || !response2.ok) {
          throw new Error('Network response was not ok');
        }
        const data1 = await response1.json();
        const data2 = await response2.json();

        console.log(data1);
        console.log(data2);

        setPortfolioSummaries1(data1);
        setPortfolioSummaries2(data2);
      }
      
    } catch (err) {
      console.error('There was an error fetching the portfolio details:', err);
    }
  };
 

  const fetchPortfolioVolalities = async () => {
    if (!chosenPortfolio1 || !chosenPortfolio2) return;

    let endpoint1 = `portfolioStocks/${chosenPortfolio1.portfolioId}/volatility`;  // Default to monthly data
    let endpoint1Annual = `portfolioStocks/${chosenPortfolio1.portfolioId}/volatility/annualized`;

    let endpoint2 = `portfolioStocks/${chosenPortfolio2.portfolioId}/volatility`;  // Default to monthly data
    let endpoint2Annual = `portfolioStocks/${chosenPortfolio2.portfolioId}/volatility/annualized`;

    try {
      const response1 = await getAsync(`${endpoint1}`, cookies.accessToken); // Use the accessToken from cookies
      const response1Annual = await getAsync(`${endpoint1Annual}`, cookies.accessToken); // Use the accessToken from cookies

      const response2 = await getAsync(`${endpoint2}`, cookies.accessToken); // Use the accessToken from cookies
      const response2Annual = await getAsync(`${endpoint2Annual}`, cookies.accessToken); // Use the accessToken from cookies

      if (!response1.ok || !response2.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData1 = await response1.json();
      const responseData2 = await response2.json();
      const responseData1Annual = await response1Annual.json();
      const responseData2Annual = await response2Annual.json();

      setPortfolioVolatility1(responseData1.portfolioVolatility);
      setPortfolioVolatility2(responseData2.portfolioVolatility);
      setPortfolioVolatility1Annual(responseData1Annual.portfolioVolatility);
      setPortfolioVolatility2Annual(responseData2Annual.portfolioVolatility);
    } catch (error) {
      console.error('There was an error fetching the portfolio details:', error);
    }
  };

  
  

  const mergeChartData = () => {
    // Implement your chart data merging logic here
  };

  // Utility function to safely convert a number to a fixed number of decimal places
  function toFixedSafe(value, digits = 2, defaultValue = 'N/A') {
    try {
      // Ensure the value is a number by coercing the value
      const number = Number(value);
      // Check if the number is actually a valid finite number
      if (Number.isFinite(number)) {
        return number.toFixed(digits);
      } else {
        // Handle cases where the number is Infinity or NaN
        throw new Error('Value is not a finite number');
      }
    } catch (error) {
      console.error(error);
      // Return a default value or indicator
      return defaultValue;
    }
  }

  // Now use the utility function for your variables
  const volAnnual1 = toFixedSafe(portfolioVolatility1Annual);
  const volAnnual2 = toFixedSafe(portfolioVolatility2Annual);
  const vol1 = toFixedSafe(portfolioVolatility1);
  const vol2 = toFixedSafe(portfolioVolatility2);
  console.log(vol2)

  function getOverallReturn(portfolioSummaries) {
    // Check if the portfolioSummaries object exists
    if (!portfolioSummaries) {
      console.error("Error: portfolioSummaries is not defined.");
      return ''; // or you can return a default value or throw an error
    }

    // Check if the overallReturn property exists
    if (!portfolioSummaries.overallReturns) {
      console.error("Error: overallReturn is not defined in the portfolioSummaries object.");
      return ''; // or you can return a default value or throw an error
    }

    // If everything checks out, return the overallReturn value
    return portfolioSummaries.overallReturns;
  }

  function getStockReturns(portfolioSummaries) {
    // Check if the portfolioSummaries object exists
    if (!portfolioSummaries) {
      console.error("Error: portfolioSummaries is not defined.");
      return ''; // or you can return a default value or throw an error
    }

    // Check if the overallReturn property exists
    if (!portfolioSummaries.stockReturns) {
      console.error("Error: stockReturns is not defined in the portfolioSummaries object.");
      return ''; // or you can return a default value or throw an error
    }

    // If everything checks out, return the overallReturn value
    return portfolioSummaries.stockReturns;
  }

  // Usage:
  const summary1 = getStockReturns(portfolioSummaries1);
  const summary2 = getStockReturns(portfolioSummaries2);

  console.log(summary1);
  console.log(summary2);

  const overallReturn1 = getOverallReturn(portfolioSummaries1).overalReturn;
  const overallReturn2 = getOverallReturn(portfolioSummaries2).overalReturn;
  const overallReturn1Percentage = getOverallReturn(portfolioSummaries1).percentage;
  const overallReturn2Percentage = getOverallReturn(portfolioSummaries2).percentage;

  // Effect to fetch data for both portfolios
  useEffect(() => {
    fetchOverallPortfolio();
    fetchPortfolioSummaries();
    fetchPortfolioVolalities();

    
  }, [chosenPortfolio1, chosenPortfolio2]);

  // useEffect(() => {
  //   const fetchPortfolioData = async () => {
  //     if (!chosenPortfolio1 || !chosenPortfolio2) return;
  
  //     // Prepare endpoints for all required data
  //     const endpoints = [
  //       `portfolios/${chosenPortfolio1.portfolioId}`,
  //       `portfolios/${chosenPortfolio2.portfolioId}`,
  //       `portfolioStocks/${chosenPortfolio1.portfolioId}/summary`,
  //       `portfolioStocks/${chosenPortfolio2.portfolioId}/summary`,
  //       `portfolioStocks/${chosenPortfolio1.portfolioId}/volatility`,
  //       `portfolioStocks/${chosenPortfolio1.portfolioId}/volatility/annualized`,
  //       `portfolioStocks/${chosenPortfolio2.portfolioId}/volatility`,
  //       `portfolioStocks/${chosenPortfolio2.portfolioId}/volatility/annualized`,
  //     ];
  
  //     try {
  //       const results = await fetchAllEndpoints(endpoints, cookies.accessToken);
  //       console.log(results);
  
  //       // Extract the responses and set state or handle data accordingly
  //       const [portfolioData1, portfolioData2, portfolioSummaries1, portfolioSummaries2, 
  //              portfolioVolatility1, portfolioVolatility1Annual, 
  //              portfolioVolatility2, portfolioVolatility2Annual] = results;
        
  //       // Update the state or perform further actions with the fetched data
  //       setPortfolioData1(portfolioData1);
  //       setPortfolioData2(portfolioData2);
  //       setPortfolioSummaries1(portfolioSummaries1);
  //       setPortfolioSummaries2(portfolioSummaries2);
  //       setPortfolioVolatility1(portfolioVolatility1);
  //       setPortfolioVolatility1Annual(portfolioVolatility1Annual);
  //       setPortfolioVolatility2(portfolioVolatility2);
  //       setPortfolioVolatility2Annual(portfolioVolatility2Annual);
  //     } catch (error) {
  //       console.error('There was an error fetching the portfolio data:', error);
  //       // Handle the error by setting fallback states or showing messages
  //     }
  //   };
  
  //   fetchPortfolioData();
  // }, [chosenPortfolio1, chosenPortfolio2, cookies.accessToken]); // Add dependencies for useEffect here
  

  // Render the chart or a loading indicator
  return (
    console.log(summary2),
    <div>
      {/* Your chart rendering logic will go here */}
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {/* This is the first half of the page for portfolioData1 */}
        {/* This is the second half of the page for portfolioData2 */}
        <Box flex={1} margin={2} padding={3} style={{ backgroundColor: colors.primary[400] }} borderLeft={3}>
          <Typography variant="h2" fontWeight="bold" fontStyle="italic" style={{ color: colors.greenAccent[400] }}>
            ID {portfolioData1.portfolioId}: {portfolioData1.name}
          </Typography>
          <Typography mt={2} variant="h4" fontWeight="bold">
            Portfolio Description:
          </Typography>
          <Typography mt={1} variant="h5" fontStyle="italic">
            {portfolioData1.description}
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
                  ${portfolioData1.totalCapital - portfolioData1.remainingCapital}
                </Typography>
              </Box>
              <Box flex={1} margin={1}>
                <Typography mt={1} variant="h5" fontWeight="bold" fontStyle="italic" style={{ color: colors.blueAccent[400] }}>
                  Overall Returns:
                </Typography>
                <Typography variant="h3" fontWeight="bold" style={{ color: overallReturn1 < 0 ? colors.redAccent[300] : colors.greenAccent[300] }}>
                  {overallReturn1} <span style={{ color: overallReturn1 < 0 ? colors.redAccent[300] : colors.greenAccent[300] }}>({overallReturn1Percentage}%)</span>
                </Typography>
              </Box>
            </Box>
            <Box flex={1} margin={1}>
              <Box flex={1} margin={1}>
                <Typography mt={1} variant="h5" fontWeight="bold" fontStyle="italic" style={{ color: colors.blueAccent[400] }}>
                  Remaining Capital:
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  ${portfolioData1.remainingCapital}
                </Typography>
                <Box flex={1}>
                  <Typography mt={1} variant="h5" fontWeight="bold" fontStyle="italic" style={{ color: colors.blueAccent[400] }}>
                    Capital Allocation:
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    ${portfolioData1.totalCapital}
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
                {vol1}
              </Typography>
            </Box>
            <Box flex={1} margin={1}>
              <Typography mt={1} variant="h5" fontWeight="bold" fontStyle="italic" style={{ color: colors.blueAccent[400] }}>
                Volatility Annualized:
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {volAnnual1}
              </Typography>
            </Box>
          </Box>
          </Box>
          <Divider />
          <br />
          <PortfolioBreakdown portfolioStockData={portfolioData1.portfolioStocks} />
          <br />
          <Divider />
          <br />
          <ReturnsTable stockData= {portfolioData1} stockReturns={summary1} />
          
          
        </Box>

        {/* This is the second half of the page for portfolioData2 */}
        <Box flex={1} margin={2} padding={3} style={{ backgroundColor: colors.primary[400] }} borderLeft={3}>
          <Typography variant="h2" fontWeight="bold" fontStyle="italic" style={{ color: colors.greenAccent[400] }}>
            ID {portfolioData2.portfolioId}: {portfolioData2.name}
          </Typography>
          <Typography mt={2} variant="h4" fontWeight="bold">
            Portfolio Description:
          </Typography>
          <Typography mt={1} variant="h5" fontStyle="italic">
            {portfolioData2.description}
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
                  ${portfolioData2.totalCapital - portfolioData2.remainingCapital}
                </Typography>
              </Box>
              <Box flex={1} margin={1}>
                <Typography mt={1} variant="h5" fontWeight="bold" fontStyle="italic" style={{ color: colors.blueAccent[400] }}>
                  Overall Returns:
                </Typography>
                <Typography variant="h3" fontWeight="bold" style={{ color: overallReturn2 < 0 ? colors.redAccent[300] : colors.greenAccent[300] }}>
                  {overallReturn2} <span style={{ color: overallReturn2 < 0 ? colors.redAccent[300] : colors.greenAccent[300] }}>({overallReturn2Percentage}%)</span>
                </Typography>
              </Box>
            </Box>
            <Box flex={1} margin={1}>
              <Box flex={1} margin={1}>
                <Typography mt={1} variant="h5" fontWeight="bold" fontStyle="italic" style={{ color: colors.blueAccent[400] }}>
                  Remaining Capital:
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  ${portfolioData2.remainingCapital}
                </Typography>
                <Box flex={1}>
                  <Typography mt={1} variant="h5" fontWeight="bold" fontStyle="italic" style={{ color: colors.blueAccent[400] }}>
                    Capital Allocation:
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    ${portfolioData2.totalCapital}
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
                  {vol2}
                </Typography>
              </Box>
              <Box flex={1} margin={1}>
                <Typography mt={1} variant="h5" fontWeight="bold" fontStyle="italic" style={{ color: colors.blueAccent[400] }}>
                  Volatility Annualized:
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  {volAnnual2}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Divider />
          <br />
          <PortfolioBreakdown portfolioStockData={portfolioData2.portfolioStocks} />
          <br />
          <Divider />
          <br />
          <ReturnsTable stockData= {portfolioData2} stockReturns={summary2} />
          
          
        </Box>
      </Box>
    </div>
  );
};

export default ComparePortfolioChart;
