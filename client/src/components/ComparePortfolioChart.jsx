import React, { useState, useEffect } from 'react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';
import { useCookies } from "react-cookie";
import { getAsync } from '../utils/utils';
import { Typography, Box, Table } from '@mui/material';
import { tokens } from "../theme";


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

  const[portfolioSummaries1, setPortfolioSummaries1] = useState(null);
  const[portfolioSummaries2, setPortfolioSummaries2] = useState(null);

  const[portfolioVolatility1, setPortfolioVolatility1] = useState(null);
  const[portfolioVolatility2, setPortfolioVolatility2] = useState(null);
  const[portfolioVolatility1Annual, setPortfolioVolatility1Annual] = useState(null);
  const[portfolioVolatility2Annual, setPortfolioVolatility2Annual] = useState(null);

  const [chartData, setChartData] = useState([]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

    // Fetch data for both portfolios
    const fetchOverallPortfolio = async () => {
      console.log(chosenPortfolio1.portfolioId);
      try {
        if (!chosenPortfolio1 || !chosenPortfolio2) return;
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

      } catch (err) {
        console.error('There was an error fetching the portfolio details:', err);
      }
    };

    const fetchPortfolioSummaries = async () => {
      
      try {
        if (!chosenPortfolio1 || !chosenPortfolio2) return;
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

        console.log(responseData1);
        console.log(responseData2);
        console.log(responseData1Annual);
        console.log(responseData2Annual);

        setPortfolioVolatility1(responseData1);
        setPortfolioVolatility2(responseData2);
        setPortfolioVolatility1Annual(responseData1Annual);
        setPortfolioVolatility2Annual(responseData2Annual);

      } catch (error) {
        console.error('There was an error fetching the portfolio details:', error);
      }

    };

    const mergeChartData = () => {

    }
    


  // Effect to fetch data for both portfolios
  useEffect(() => {
    fetchOverallPortfolio();
    fetchPortfolioSummaries();
    fetchPortfolioVolalities();
  }, [chosenPortfolio1, chosenPortfolio2]);


   // Render the chart or a loading indicator
   return (
    <div>
      {/* Your chart rendering logic will go here */}
      <Box 
        display="flex" 
        flexDirection="row" 
        justifyContent="space-between" 
        alignItems="center" 
        width="100%"
      >
        {/* This is the first half of the page for portfolioData1 */}
        <Box flex={1} margin={2}>
          <Typography variant="h3" fontWeight="bold">
            {portfolioData1.name}
          </Typography>
          <Typography mt={2}>
            {portfolioData1.description}
          </Typography>
          {/* Include other content for portfolioData1 here */}
        </Box>

        {/* This is the second half of the page for portfolioData2 */}
        <Box flex={1} margin={2} padding={3} style={{backgroundColor: colors.primary[400]}} borderLeft={3}>
          <Typography variant="h3" fontWeight="bold" fontStyle="italic">
            ID {portfolioData2.portfolioId}: {portfolioData2.name} 
          </Typography>
          <Typography mt={2} variant="h5" fontStyle="italic">
            {portfolioData2.description}
          </Typography>
          <Typography variant="h4" fontWeight="bold" style={{ textDecoration: 'underline' }} mt={1}> Portfolio Volatility </Typography>
          <Typography mt={2} variant="h5" fontStyle="italic">
            Volatility: {portfolioVolatility2}
          </Typography>
          <Typography variant="h5" fontStyle="italic">
            Volatility Annualized: {portfolioVolatility2Annual}
          </Typography>
          {/* Include other content for portfolioData2 here */}
          <Table>
            {/* Table content goes here */}
          </Table>
        </Box>
      </Box>

      
      
    </div>
  );

};


export default ComparePortfolioChart;
