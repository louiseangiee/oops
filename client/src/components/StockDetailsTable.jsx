import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from "../theme";
import { useCookies } from 'react-cookie';
import { getAsync } from '../utils/utils';
import StockSelector from './StockSelectorDropdown';
import StockChart from './StockChart';

function StockDetailsTable({ chosenStock }) {
    const [overviewDetails, setOverviewDetails] = useState({});
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [cookie] = useCookies();

    useEffect(() => {
        if (!chosenStock || !chosenStock.code) return;
    
        const fetchOverviewData = async () => {
            try {
                const response = await getAsync(`stocks/overviewData?symbol=${chosenStock.code}`,cookie.accessToken);
                const data = await response.json(); 
                setOverviewDetails(data);
            } catch (error) {
                console.error("Failed to load stock overview data:", error);
            }
        };
    
        fetchOverviewData();
    
    }, [chosenStock]);

    const name = overviewDetails.Name;
    const description = overviewDetails.Description;
    const sector = overviewDetails.Sector;
    const Industry = overviewDetails.Industry;

    const entriesToDisplay = [
        ["Market Capitalization", overviewDetails.MarketCapitalization],
        ["PE Ratio", overviewDetails.PERatio],
        ["Dividend Yield", overviewDetails.DividendYield],
        ["EPS", overviewDetails.EPS],
        ["52 Week High", "$"+overviewDetails["52WeekHigh"]],
        ["52 Week Low", "$"+overviewDetails["52WeekLow"]],
    ];

    return (
        
            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" marginTop={3}>
                <Box style={{ width: '50%', marginRight: "30px" }}> 
                    <Typography variant='h2' fontWeight="bold" marginBottom={2}> {name} </Typography>
                    <Typography fontWeight="bold"> Sector: {sector} </Typography>
                    <Typography fontWeight="bold" marginBottom={2}> Industry: {Industry} </Typography>
                    <Typography fontStyle="italic"> {description}</Typography>
                    
                </Box>

                <TableContainer flex={2}  style={{ width: '100%', height: '100%'}}>
                    <Table size="small">
                        <TableBody style={{padding: "10px"}}>
                            {entriesToDisplay.map(([key, value]) => (
                                <TableRow key={key} >
                                    <TableCell>{key}</TableCell>
                                    <TableCell align="right">{value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            
        
    );
}

export default StockDetailsTable;
