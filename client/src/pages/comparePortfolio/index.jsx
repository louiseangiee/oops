import React, { useState } from "react";
import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";

import ComparePortfolioComponent from "../../components/ComparePortfolioComponent";

const ComparePortfolio = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <>
            <Box m="20px">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Header title="Compare Portfolio" subtitle="Compare Portfolio Performance" />
                </Box>
                
                    <ComparePortfolioComponent />
                
            </Box>
            
        </>
    );
};

export default ComparePortfolio;
