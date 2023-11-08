import React from "react";
import { Box, useTheme, Button } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import PorfolioBarChart from "../../components/OverallReturnsBarChart";
import PortfolioBreakdown from "../../components/UserPortfoliosBreakdown";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import OverviewPortfolioValue from "../../components/OverviewPortfolioValue";

const Analytics = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Analytics" subtitle="Overview of your Account" />

        <Box>
          <a href="/compare-portfolio" style={{ textDecoration: 'none' }}>
            <Button
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
            >
              <CompareArrowsIcon sx={{ mr: "10px" }} />
              Compare Portfolios
            </Button>
          </a>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="120px"
        gap="20px"
      >
        {/* TOTAL PORTFOLIO VALUE */}
        <Box
          gridColumn="span 3"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="left"
          flexDirection="column"
          justifyContent="left"
          p={5}
        >
          <OverviewPortfolioValue />

        </Box>

        {/* YOUR PORTFOLIOS */}
        <Box
          gridColumn="span 9"
          gridRow="span 7"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="left"
          flexDirection="column" // Adjusted from "column"
          justifyContent="flex-start"
          p={5}
        >
          <div className="stock-page">

            <PorfolioBarChart />

            <PortfolioBreakdown />

          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default Analytics;
