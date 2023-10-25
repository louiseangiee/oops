import React, { useState } from "react";
import { Box, Typography, useTheme, Chip } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import StockChart from "../../components/StockChart";
import StockSelector from "../../components/StockSelectorDropdown";
import StockDetailsTable from "../../components/StockDetailsTable";
import { useCookies } from "react-cookie"; // If you decide to use cookies again in the future
import { getAsync } from "../../utils/utils";
import PorfolioBarChart from "../../components/OverallReturnsBarChart";
import PortfolioBreakdown from "../../components/UserPortfoliosBreakdown";

const ComparePortfolio = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);



    return(
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Compare Portfolio" subtitle="Compare Portfolio Performance" />

        
            </Box>
        </Box>
    );
    
};

export default ComparePortfolio;
