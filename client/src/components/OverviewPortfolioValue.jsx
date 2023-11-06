import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, Chip, Button } from "@mui/material";
import { tokens } from "../theme";
import Header from "../components/Header";
import CreatePortfolio from "../components/CreatePortfolioForm";
import StockChart from "../components/StockChart";
import StockSelector from "../components/StockSelectorDropdown";
import StockDetailsTable from "../components/StockDetailsTable";
import { useCookies } from "react-cookie"; // If you decide to use cookies again in the future
import { getAsync } from "../utils/utils";

// This is now a custom hook
const useUserID = () => {
    const [cookie] = useCookies();
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);
    const [portfolioSummary, setPortfolioSummary] = useState(null);
    
    useEffect(() => {
        const fetchData = async() => {
            try {
                console.log(cookie.email)
                const response = await getAsync(`users/user?email=${cookie.email}`, cookie.accessToken);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                if (data && data.id) {
                    setUserId(data.id);
                }

            } catch (err) {
                console.error('There was an error fetching the user details:', err);
                setError(err);
            }
        };

        fetchData();

    }, [cookie]);

    return userId; // Only returning userId, but you can also return error if you need to handle it elsewhere
};


const OverviewPortfolioValue = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    
    return (
       <>
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
                color: "#fff",
                fontSize: "1.1rem",
                padding: "0.5rem",
                textAlign: "left",
                width: "50%", // Set width to 1/4 of the container width
            }} />
                
        <Box height="20px" />
                
        <Typography variant="h4" fontWeight="bold">
            Yesterday: S$ 19348 
        </Typography>
        </>
    );
};

export default OverviewPortfolioValue;