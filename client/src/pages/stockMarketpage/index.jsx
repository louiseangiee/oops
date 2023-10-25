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

const StockMarketPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // We will store the entire stock object instead of just the code
    const [chosenStock, setChosenStock] = React.useState({
        code: "AAPL",
        name: "Apple Inc. (AAPL)",
    });

    const handleStockChange = (newValue) => {
        setChosenStock(newValue ? newValue : null);
    };

    

    return (
        <><Box m="20px">
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Stock Market" subtitle="Be updated on the latest Changes" />


            </Box>
        </Box><Box m="20px">
                <StockSelector
                    chosenStock={chosenStock}
                    handleStockChange={handleStockChange} />
                <Box display="flex" justifyContent="space-between">
                    {/* StockDetailstable */}
                    <Box flex="1" paddingRight="10px">
                        <StockDetailsTable chosenStock={chosenStock} />
                    </Box>

                    {/* Line chart for the chosen stock */}
                    <Box flex="2">
                        <StockChart chosenStock={chosenStock} />
                    </Box>
                </Box>
            </Box></>
    );

}

export default StockMarketPage;