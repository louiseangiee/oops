import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import PortfolioCard from "../../components/PortfolioCard";
import CreatePortfolio from "../../components/CreatePortfolioForm";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import Lottie from 'lottie-react';
import loading from './fetching_data.json';
import noData from './no_data.json';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);
  const [dataFetched, setDataFetched] = useState(null);

  const { userData } = useAuth();

  useEffect(() => {
    console.log(userData);
    if (!userData.portfolios) {
      setDataFetched(null);
    } else {
      setDataFetched(userData.portfolios);
    }
  }, [userData, dataFetched]);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="PORTFOLIOS" subtitle="Welcome to your portfolios page!" />

        <Box>
          <CreatePortfolio />
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      {!dataFetched ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Lottie
            animationData={loading}
            loop={true} // Set to true for looping
            autoplay={true} // Set to true to play the animation automatically
            style={{ width: 300, height: 300 }}
          />
        </Box>

      ) : dataFetched.length === 0 ? (

        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">

          <Lottie
            animationData={noData}
            loop={true} // Set to true for looping
            autoplay={true} // Set to true to play the animation automatically
            style={{ width: 300, height: 300 }}
          />
          <Typography variant="h4" fontWeight="600" color={colors.grey[100]} mb="20px">
            You have no portfolios yet. Create one now!
          </Typography>
        </Box>

      ) : (
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
      )
      }
    </Box>
  );
};

export default Home;