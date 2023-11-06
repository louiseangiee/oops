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
    
    useEffect(() => {
        const fetchData = async() => {
            try {
                const response = await getAsync(`users/user?email=${cookie.email}`, cookie.accessToken);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                // console.log(data);

                if (data && data.id) {
                    setUserId(data.id);
                }

            } catch (err) {
                console.error('There was an error fetching the user details:', err);
                setError(err);
            }
        };

        fetchData();
        // console.log(userId);

    }, [cookie]);

    return userId; // Only returning userId, but you can also return error if you need to handle it elsewhere
};


const OverviewPortfolioValue = ({portfolioId}) => {
    const [portfolioSummary, setPortfolioSummary] = useState(null);
    const [cookie] = useCookies();
    const theme = useTheme();
    const userId = useUserID();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        if (!userId) return;

        const fetchPortfolioSummary = async () => {
          try {
            console.log(userId);
            
            // Get the list of portfolio ids for the user
            const portfolioResponse = await getAsync(`portfolios/user/${userId}`, cookie.accessToken);
            if (!portfolioResponse.ok) {
                throw new Error('Failed to fetch portfolio ids');
            }

            const portfoliosData = await portfolioResponse.json();
            console.log(portfoliosData);

            // Map through each portfolio and fetch their summaries
            const summariesPromises = portfoliosData.map(async (portfolio) => {
                const summaryResponse = await getAsync(`portfolioStocks/${portfolio.id}/summary`, cookie.accessToken);
                if (!summaryResponse .ok) {
                    throw new Error('Network response was not ok');
                }
                return await summaryResponse.json();
            });

            const summaries = await Promise.all(summariesPromises);
            // setPortfolioSummaries(summaries);

            } catch (error) {
                console.error('Failed to fetch portfolio summaries:', error);
            }
        };

        //     const response = await getAsync(`portfolioStocks/11/summary`, cookie.accessToken);
        //     if (!response.ok) {
        //       throw new Error('Network response was not ok');
        //     }
        //     const data = await response.json();
        //     console.log(data);
        //     setPortfolioSummary(data);
        //   } catch (error) {
        //     console.error('Failed to fetch portfolio summary:', error);
        //   }
        // };
    
        fetchPortfolioSummary();
    },[userId, cookie.accessToken]);

    // Assuming you want to display the total portfolio value and overall return percentage
    const totalPortfolioValue = portfolioSummary?.totalPortfolioValue?.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });

    const overallReturnPercentage = portfolioSummary?.overallReturns?.percentage.toFixed(2);
    // console.log(overallReturnPercentage);
    
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
           {totalPortfolioValue || "Loading..."}
        </Typography>

        <Box height="10px" />
        <Chip
            label={`${overallReturnPercentage}%`}
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