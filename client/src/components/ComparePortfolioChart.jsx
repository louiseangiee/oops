import React, { useState, useEffect } from 'react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';
import { ButtonGroup, Button } from '@mui/material';
import { tokens } from "../theme";
import { colors } from '@mui/material';
import { getAsync } from '../utils/utils';
import { useCookies } from "react-cookie";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc', color: "black" }}>
          <p className="label">{`Date: ${label}`}</p>
          <p className="value">{`Value: $${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
  
    return null;
  };



const ComparePortfolioChart = ({chosenPortfolio1, chosenPortfolio2}) => {
    const [cookie] = useCookies()
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [chartData, setChartData] = useState([]); 

    useEffect(() => {
        fetchDataPortfolio1();
        fetchDataPortfolio2();

    }, [chosenPortfolio1, chosenPortfolio2]);

    const fetchDataPortfolio1 = async () => {
        try {
            const response = await getAsync(`/portfolios/${chosenPortfolio1.portfolioId}`, cookie.accessToken);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data)
            setChartData(data);
        } catch (err) {
            console.error('There was an error fetching the stock details:', err);
        }
    };

    
    

};

return ComparePortfolioChart;