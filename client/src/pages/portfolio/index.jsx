import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import Header from "../../components/Header";
import PortfolioCard from "../../components/PortfolioCard";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import EditPortfolio from "../../components/EditPortfolio";
import StatBox from "../../components/StatBox";
import StocksTabs from "../../components/StocksTabs";
import { useParams, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useCookies } from "react-cookie";
import { getAsync, putAsync } from "../../utils/utils";

const Portfolio = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [cookie, removeCookie] = useCookies(["accessToken"]);

  // Access the portfolio_id parameter from the URL
  const { portfolioId } = useParams();

  // State to store portfolio data
  const [portfolioData, setPortfolioData] = useState({});

  // Fetch the portfolio data based on portfolioId
  useEffect(() => {
    // Replace this with your actual data fetching logic
    // Example: fetch portfolio data using portfolioId
    async function fetchData() {
      const response = await getAsync('portfolios/' + portfolioId, cookie.accessToken);
      const data = await response.json();
      setPortfolioData(data);
      console.log(data);
    }
    fetchData();
  }, [portfolioId]);

  const location = useLocation();
  const formData = location.state ? location.state.formData : null;
  // if (!formData) {
  //   // Handle the case where formData is not available, e.g., show an error message.
  //   return <div>ERROR: No formData available</div>;
  // }
  // console.log(formData);

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/" sx={{ fontSize: "22px" }}>
      <h1>PORTFOLIOS</h1>
    </Link>,
    <Typography key="2" color="text.primary" sx={{ fontSize: "22px" }}>
      <h1>{portfolioData['name'] ? portfolioData['name'] : "Loading..."}</h1>
    </Typography>,
  ];

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <Breadcrumbs separator="/" aria-label="breadcrumb" sx={{ height: "75px" }}>
            {breadcrumbs}
          </Breadcrumbs>
          <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb="20px">
            {portfolioData['description'] ? portfolioData['description'] : 'Loading...'}
          </Typography>
        </Box>

        {/* <Header title={"Portfolio > "+formData['portfolioName']} subtitle={formData['portfolioDescription']} /> */}

        <Box>
          <EditPortfolio portfolioId={portfolioId}/>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="100px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 6"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="flex-start"
          justifyContent="center"
          flexDirection="column"
          gap="5px"
          pl="20px"
          borderRadius="10px"
        >
          <Typography
            variant="h6"
            fontStyle="italic"
            sx={{ color: colors.grey[300] }}
          >
            Capital
          </Typography>
          <Typography
            variant="h1"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            ${portfolioData['totalCapital']? portfolioData['totalCapital'] : '-'}
          </Typography>

        </Box>
        <Box
          gridColumn="span 6"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="flex-start"
          justifyContent="center"
          flexDirection="column"
          gap="5px"
          pl="20px"
          borderRadius="10px"
        >
          <Typography
            variant="h6"
            fontStyle="italic"
            sx={{ color: colors.grey[300] }}
          >
            Return
          </Typography>
          <Typography
            variant="h1"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            ${portfolioData['performanceMetrics']?.overallReturns || '-'}
          </Typography>

        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 12"
          // gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <StocksTabs />
        </Box>
      </Box>
    </Box>
  );
};

export default Portfolio;