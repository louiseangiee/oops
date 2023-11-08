import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from "../theme";
import { useCookies } from 'react-cookie';
import { getAsync } from '../utils/utils';
import Lottie from 'lottie-react';
import loadingLight from "../components/lotties/loading_light.json"

function StockDetailsTable({ chosenStock }) {
    const [overviewDetails, setOverviewDetails] = useState({});
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [cookie] = useCookies();
    const [responseReturns, setResponseReturns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingAll, setIsLoadingAll] = useState(false);

    const [timeSpan, setTimeSpan] = useState("1 Year");

    useEffect(() => {
        if (!chosenStock || !chosenStock.code) return;

        const fetchOverviewData = async () => {
            setIsLoading(true);
            setIsLoadingAll(true);
            let endpointReturns = 'stocks/calculateOneYearReturn';  // Default to 1 year data
            switch (timeSpan) {
                case "1 Year":
                    endpointReturns = 'stocks/calculateOneYearReturn';
                    break;
                case "1 Day":
                    endpointReturns = 'stocks/calculateOneDayReturn';
                    break;
                case "1 Month":
                    endpointReturns = 'stocks/calculateOneMonthReturn';
                    break;
                case "1 Week":
                    endpointReturns = 'stocks/calculateOneWeekReturn';
                    break;
                default:
                    endpointReturns = 'stocks';
            }
            try {
                const requests = [
                    getAsync(`stocks/overviewData?symbol=${chosenStock.code}`, cookie.accessToken),
                    getAsync(`${endpointReturns}?symbol=${chosenStock.code}`, cookie.accessToken),

                ];

                // Use Promise.all to execute all requests concurrently
                const responses = await Promise.all(requests);

                // Check all responses - if any request failed, throw an error
                responses.forEach(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                });

                // Parse JSON for all responses
                const data = await Promise.all(responses.map(response => response.json()));

                // Assuming the first response is the one with the data we need to map for the chart
                setOverviewDetails(data[0]);
                setResponseReturns(data[1]);
                setIsLoading(false);
                setIsLoadingAll(false);


            } catch (error) {
                console.error("Failed to load stock overview data:", error);
                setIsLoading(false);
                setIsLoadingAll(false);
            }
        };

        fetchOverviewData();

    }, [chosenStock, timeSpan]);

    const name = overviewDetails.Name;
    const description = overviewDetails.Description;
    const sector = overviewDetails.Sector;
    const Industry = overviewDetails.Industry;

    const entriesToDisplay = [
        ["Market Capitalization", overviewDetails.MarketCapitalization],
        ["PE Ratio", overviewDetails.PERatio],
        ["Dividend Yield", overviewDetails.DividendYield],
        ["EPS", overviewDetails.EPS],
        ["52 Week High", "$" + overviewDetails["52WeekHigh"]],
        ["52 Week Low", "$" + overviewDetails["52WeekLow"]],
    ];

    return (
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" marginTop={3} >
            {isLoadingAll ?
                <Lottie
                    animationData={loadingLight}
                    loop={true} // Set to true for looping
                    autoplay={true} // Set to true to play the animation automatically
                    style={{ width: '100%', height: '150px', padding: 0, justifyContent: 'center' }} // Customize the dimensions
                /> : <>
                    <Box style={{ width: '50%', marginRight: "30px" }}>
                        <Typography variant='h2' fontWeight="bold" marginBottom={2}> {name} </Typography>
                        <Typography fontWeight="bold"> Sector: {sector} </Typography>
                        <Typography fontWeight="bold" marginBottom={2}> Industry: {Industry} </Typography>
                        <Typography fontStyle="italic"> {description}</Typography>
                    </Box>


                    <TableContainer flex={2} style={{ width: '100%', height: '100%' }}>
                        <Box display="flex" justifyContent="flex-end" m={2}>

                            <Select
                                value={timeSpan}
                                onChange={(event) => setTimeSpan(event.target.value)}
                                sx={{ border: '1px solid gray', borderRadius: '4px', width: '150px' }}
                                m={1}
                            >
                                <MenuItem value="1 Year">1 Year</MenuItem>
                                <MenuItem value="1 Month">1 Month</MenuItem>
                                <MenuItem value="1 Week">1 Week</MenuItem>
                                <MenuItem value="1 Day">1 Day</MenuItem>
                            </Select>
                            <br />
                        </Box>

                        <Table size="small">
                            <TableBody style={{ padding: "10px" }}>
                                {isLoading ? (
                                    <div>Loading...</div>
                                ) : (
                                    entriesToDisplay.map(([key, value]) => (
                                        <TableRow key={key}>
                                            <TableCell>{key}</TableCell>
                                            <TableCell align="right">{value}</TableCell>
                                        </TableRow>
                                    )))}

                                <TableRow>
                                    <TableCell >{timeSpan} Potential Returns </TableCell>
                                    <TableCell align="right">${typeof responseReturns === 'number' ? responseReturns.toFixed(2) : 'N/A'}</TableCell>
                                </TableRow>

                            </TableBody>
                        </Table>
                    </TableContainer>
                </>}
        </Box>

    );
}

export default StockDetailsTable;
