import React, { useState } from "react";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import StockChart from "../../components/StockChart";
import StockSelector from "../../components/StockSelectorDropdown";
import StockDetailsTable from "../../components/StockDetailsTable";

const StockMarketPage = () => {

    // We will store the entire stock object instead of just the code
    const [chosenStock, setChosenStock] = useState({
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
        </Box>
            <Box m="20px">
                <StockSelector
                    chosenStock={chosenStock}
                    handleStockChange={handleStockChange} />

                {/* StockDetailstable */}
                <Box paddingX={3} >

                    <StockDetailsTable chosenStock={chosenStock} />
                </Box>
                <Box paddingX={3}>
                    <StockChart chosenStock={chosenStock} />
                </Box>
            </Box></>
    );

}

export default StockMarketPage;