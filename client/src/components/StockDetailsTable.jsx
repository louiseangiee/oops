import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from "../theme";

function StockDetailsTable({ chosenStock }) {
    const [details, setDetails] = useState({});
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        console.log(chosenStock)
        if (!chosenStock || !chosenStock.code) return;

        import(`../data/${chosenStock.code}Data.json`)
        .then(module => {
            const computedDetails = computeDetails(module.default);
            setDetails(computedDetails);
        })
        .catch(err => {
            console.error("Failed to load stock data:", err);
        });
    }, [chosenStock]);

    const computeDetails = (chosenStockData) => {
        console.log(chosenStockData)
        const today = chosenStockData["2023-10-12"]; // Dynamically update later
        const yesterday = chosenStockData["2023-10-11"];
        
        const computedDetails = {
            "Previous close": yesterday["4. close"],
            "Day's range": `${today["3. low"]} - ${today["2. high"]}`,
            "Open": today["1. open"],
            // Assuming you will fetch data for 52 weeks, then calculate min and max for range.
            "52-week range": "For now, static. Implement with full data.",
            "Volume": today["5. volume"],
            "Avg. volume": "For now, static. Calculate based on historical data."
        };
        console.log(computedDetails)

        return computedDetails;
        
    }

    return (
        <TableContainer component={Paper} style={{ width: '300px', marginLeft: '20px' }}>
            <Table size="small">
                <TableBody>
                    {Object.entries(details).map(([key, value]) => (
                        <TableRow key={key}>
                            <TableCell>{key}</TableCell>
                            <TableCell align="right">{value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default StockDetailsTable;

