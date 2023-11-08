import React, { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useCookies } from "react-cookie";
import PortfolioSelector from "./AvailablePortfoliosDropdown";
import ComparePortfolio from "../pages/comparePortfolio";
import ComparePortfolioChart from "./ComparePortfolioChart";
import { useEffect } from "react";
import { getAsync } from "../utils/utils";
import ComparePortfolioSingle from "./ComparePortfolioSingle";

const useUserID = () => {
    const [cookie] = useCookies();
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);
    
    
    useEffect(() => {
        const fetchData = async() => {
            try {
                console.log(cookie.email);
                const response = await getAsync(`users/user?email=${cookie.email}`, cookie.accessToken);
                console.log(response);

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

const ComparePortfolioComponent = () => {

    const userId = useUserID();
    console.log(userId);
    const [cookie] = useCookies();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    //FOR THE FIRST PORTFOLIO
    const [chosenPortfolio1, setChosenPortfolio1] = useState({name: ""});

    const handlePortfolioChange1 = (newValue) => {
        setChosenPortfolio1(newValue || null);
    };
    console.log("Chosen Portfolio1")
    console.log(chosenPortfolio1)

    //FOR THE SECOND PORTFOLIO
    const [chosenPortfolio2, setChosenPortfolio2] = useState({name: ""});

    const handlePortfolioChange2 = (newValue) => {
        setChosenPortfolio2(newValue || null);
    };

    // Function to fetch portfolios by user id
    const fetchPortfolios = async (userId) => {
        
        try {
            const response = await getAsync(`portfolios/user/${userId}`, cookie.accessToken);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // const data = await response.json();

            // Assuming the API returns an array of portfolios and you want to set the first one
            // if (data.length > 0) {
            //     setChosenPortfolio1(data[0]);
            //     setChosenPortfolio2(data[0]); // or set to data[1] if you want the second one
            // }
        } catch (error) {
            console.error("Fetching portfolios failed: ", error);
        }
    };

    useEffect(() => {
        if (userId) { // Only attempt to fetch portfolios if the userId is available
            fetchPortfolios(userId);
        }
    }, [userId]); // Adding userId to the dependency array

    return(
        <>
        <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
            <Box flex={1} p={2} >
                <Typography variant="h3" fontWeight="bold" mb={2}> Portfolio 1</Typography>
                <PortfolioSelector
                    chosenPortfolio={chosenPortfolio1}
                    handlePortfolioChange={handlePortfolioChange1} />
            </Box>

            <Box flex={1} p={2}>
                <Typography variant="h3" fontWeight="bold" mb={2}> Portfolio 2</Typography>
                <PortfolioSelector
                    chosenPortfolio={chosenPortfolio2}
                    handlePortfolioChange={handlePortfolioChange2} />
            </Box>
            </Box>


        {/* <ComparePortfolioChart chosenPortfolio1={chosenPortfolio1} chosenPortfolio2={chosenPortfolio2} /> */}
        <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        >
        <ComparePortfolioSingle chosenPortfolio={chosenPortfolio1} />
        <ComparePortfolioSingle chosenPortfolio={chosenPortfolio2} />
        </Box>
       
        
        </>

        

    );



}

export default ComparePortfolioComponent;