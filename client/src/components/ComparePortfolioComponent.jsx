import React, { useState } from "react";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useCookies } from "react-cookie";
import PortfolioSelector from "./AvailablePortfoliosDropdown";

const ComparePortfolioComponent = () => {
    
    const [cookie] = useCookies()
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);


    //FOR THE FIRST PORTFOLIO
    const [chosenPortfolio1, setChosenPortfolio1] = useState([]);

    const handlePortfolioChange1 = (newValue) => {
        setChosenPortfolio1(newValue || null);
    };
    console.log(chosenPortfolio1)

    //FOR THE SECOND PORTFOLIO
    const [chosenPortfolio2, setChosenPortfolio2] = useState([]);

    const handlePortfolioChange2 = (newValue) => {
        setChosenPortfolio2(newValue || null);
    };

    return(
        <>
        <Box display="flex" flexDirection="row">
            <Box marginX={2}>
                <PortfolioSelector
                    chosenPortfolio={chosenPortfolio1}
                    handlePortfolioChange={handlePortfolioChange1} />
            </Box>

            <Box marginX={2}>
                <PortfolioSelector
                    chosenPortfolio={chosenPortfolio2}
                    handlePortfolioChange={handlePortfolioChange2} />
            </Box>
        </Box>

        
       
        
        </>

        

    );







}

export default ComparePortfolioComponent;