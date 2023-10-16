import { Box, Button, Card, Chip, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import PortfolioCard from "../../components/PortfolioCard";
import ProgressCircle from "../../components/ProgressCircle";
import CreatePortfolio from "../../components/CreatePortfolioForm";
import AnalyticsButtons from "../../components/AnalyticsToolsButton";
import StockChart from "../../components/StockChart";
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import React from "react";
import StockSelector from "../../components/StockSelectorDropdown";
import StockDetailsTable from "../../components/StockDetailsTable";



const Analytics = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // We will store the entire stock object instead of just the code
  const [chosenStock, setChosenStock] = React.useState({ code: 'AAPL', name: 'Apple Inc. (AAPL)' });
  
  const handleStockChange = (newValue) => {
    setChosenStock(newValue ? newValue : null);
  };


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
          p ={5}

        >
          <Typography variant="h4"
                    fontStyle="italic" fontWeight="bold" 
                    color={colors.greenAccent[400]}
                   >Total Portfolio Value</Typography>
          <Box height="15px" />

          <Typography variant="h1"
                     fontWeight="bold"
                   >S$ 10000</Typography>

          <Box height="10px" />

          <Chip 
            label="+ 13.4%" 
            fontWeight="bold"
            p={2} 
            sx={{
                backgroundColor: colors.greenAccent[600], 
                color: '#fff', // Assuming you want white text
                fontSize: '1.1rem', // Increase font size as required
                padding: '0.7rem',
                textAlign: 'left', // Align text to the left
                width: '35%', // Set width to 1/4 of the container width
                }} 
          />

          <Box height="20px" />

          <Typography variant="h4"
                     fontWeight="bold"
                   >Yesterday: S$ 19348</Typography>

          

        </Box>
        
        {/* YOUR TOOLS
        <Box
        gridColumn="span 9"
        gridRow="span 1"
        backgroundColor={colors.primary[400]}
        display="flex"
        alignItems="left"
        flexDirection="column"
        justifyContent="left"
        p ={5}>

          <AnalyticsButtons
          route="/analytics"
          title="Compare Portfolio">
            
          </AnalyticsButtons>
          

        </Box> */}

        {/* YOUR PORTFOLIOS */}

        <Box
        gridColumn="span 9"
        gridRow="span 7"
        backgroundColor={colors.primary[400]}
        display="flex"
        alignItems="left"
        flexDirection="column"  // Adjusted from "column"
        justifyContent="flex-start" 
        p ={5}>
        
        
        
        
        <div className="stock-page">
          <Typography variant="h2"
                     fontWeight="bold" mb={5}
                   >Stocks Today</Typography>
            {/* Dropdown to choose the stock using MUI */}
            <StockSelector 
            chosenStock={chosenStock}
            handleStockChange={handleStockChange}
            />
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
            
            
            
        </div>

        
        
        </Box>

       
      </Box>
    </Box>
    
  );

};

export default Analytics;