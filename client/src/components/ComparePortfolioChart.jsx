import React, { useState, useEffect } from 'react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';
import { ButtonGroup, Button } from '@mui/material';
import { tokens } from "../theme";
import { colors } from '@mui/material';
import { getAsync } from '../utils/utils';
import { useCookies } from "react-cookie";


const ComparePortfolioChart = () => {
    const [cookie] = useCookies()
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [chartData, setChartData] = useState([]); 
    
    
};

return ComparePortfolioChart;