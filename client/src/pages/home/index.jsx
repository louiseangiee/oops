import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import PortfolioCard from "../../components/PortfolioCard";
import CreatePortfolio from "../../components/CreatePortfolioForm";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import { getAsync, putAsync } from "../../utils/utils";
import Lottie from 'lottie-react';
import loading from './fetching_data.json';

const Home = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [cookie, removeCookie] = useCookies(["accessToken"]);
  const [dataFetched, setDataFetched] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await getAsync('portfolios/user/1', cookie.accessToken);
      const data = await response.json();
      setDataFetched(data);
      console.log(data);
    }

    fetchData();
  }, [cookie.accessToken]);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="PORTFOLIOS" subtitle="Welcome to your portfolios page" />

        <Box>
          <CreatePortfolio />
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      {dataFetched ? (
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="auto"
          gap="20px"
        >
          {/* ROW 1 */}
          {Array.isArray(dataFetched) &&
            dataFetched.map((portfolio, index) => (
              <Box
                gridColumn="span 3"
                backgroundColor={colors.primary[400]}
                display="flex"
                alignItems="center"
                justifyContent="center"
                key={index}
                padding="20px"
              >
                <PortfolioCard
                  title={portfolio.name}
                  subtitle={portfolio.description}
                  capital={portfolio.totalCapital}
                  returns={portfolio.performanceMetrics.overallReturns}
                  stocks={portfolio.portfolioStocks}
                  portfolioId={portfolio.portfolioId}
                />
              </Box>
            ))}
        </Box>


      ) : (

        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Lottie
            animationData={loading}
            loop={true} // Set to true for looping
            autoplay={true} // Set to true to play the animation automatically
            style={{ width: 300, height: 300 }}
          />
        </Box>

      )
      }
    </Box>
  );
};

export default Home;