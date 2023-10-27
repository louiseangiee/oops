import React, { useState } from "react";
import { Box, Typography, useTheme, Chip } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import CreatePortfolio from "../../components/CreatePortfolioForm";
import StockChart from "../../components/StockChart";
import StockSelector from "../../components/StockSelectorDropdown";
import StockDetailsTable from "../../components/StockDetailsTable";
import { useCookies } from "react-cookie"; // If you decide to use cookies again in the future
import { getAsync } from "../../utils/utils";
import PorfolioBarChart from "../../components/OverallReturnsBarChart";
import PortfolioBreakdown from "../../components/UserPortfoliosBreakdown";

const Analytics = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  
  


  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Analytics" subtitle="Overview of your Account" />

        <Box>
          <CreatePortfolio />
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
          <Typography
            variant="h4"
            fontStyle="italic"
            fontWeight="bold"
            color={colors.greenAccent[400]}
          >
            Total Portfolio Value
          </Typography>
          <Box height="15px" />

          <Typography variant="h1" fontWeight="bold">
            S$ 10000
          </Typography>

          <Box height="10px" />

          <Chip
            label="+ 13.4%"
            fontWeight="bold"
            p={2}
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: "#fff", // Assuming you want white text
              fontSize: "1.1rem", // Increase font size as required
              padding: "0.7rem",
              textAlign: "left", // Align text to the left
              width: "35%", // Set width to 1/4 of the container width
            }}
          />

          <Box height="20px" />

          <Typography variant="h4" fontWeight="bold">
            Yesterday: S$ 19348
          </Typography>
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
