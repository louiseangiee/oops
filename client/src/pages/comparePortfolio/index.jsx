import React, { useState } from "react";
import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import PortfolioSelector from "../../components/AvailablePortfoliosDropdown";

const ComparePortfolio = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [chosenPortfolio, setChosenPortfolio] = useState([]);

    const handlePortfolioChange = (newValue) => {
        setChosenPortfolio(newValue || null);
    };

    return (
        <>
            <Box m="20px">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Header title="Compare Portfolio" subtitle="Compare Portfolio Performance" />
                </Box>
            </Box>
            <PortfolioSelector 
                chosenPortfolio={chosenPortfolio}
                handlePortfolioChange={handlePortfolioChange} 
            />
        </>
    );
};

export default ComparePortfolio;
