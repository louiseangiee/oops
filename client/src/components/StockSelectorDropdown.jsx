import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
import { useCookies } from 'react-cookie';
import { getAsync } from '../utils/utils';

const StockSelector = ({ chosenStock, handleStockChange }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [cookie] = useCookies();
    const [stocks, setStocks] = useState([]);
    const [error, setError] = useState(null); // To handle any errors during fetch

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAsync('stocks/stocklookup', cookie.accessToken);

                if (!response.ok) { // Check if response went through
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                const formattedData = data
                    .filter(stock => stock && stock.stockSymbol && stock.name)
                    .map(stock => ({
                        code: stock.stockSymbol,
                        name: `${stock.name} (${stock.stockSymbol})`
                    }));

                setStocks(formattedData);
            } catch (err) {
                console.error('There was an error fetching the stocks:', err);
                setError(err);
            }
        };

        fetchData();
    }, []);

    // You can use the error state to display any error messages if needed
    if (error) {
        return <div>Error fetching stocks: {error.message}</div>;
    }

    return (
        <Autocomplete
            disabled={stocks.length === 0}
            value={chosenStock}
            onChange={(event, newValue) => {
                const stockExists = stocks.some(stock => stock.code === (newValue && newValue.code));
                handleStockChange(stockExists ? newValue : null);
            }}
            options={stocks}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.code === value.code}
            style={{ minWidth: 200, marginBottom: 20 }}
            renderInput={(params) =>
                <TextField
                    {...params}
                    variant="outlined"
                    label={stocks.length === 0 ? "Loading..." : "Select Stock"}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            // Apply your input styles here
                            border: `2px solid colors.greenAccent[400]`, // Change the border color
                        },
                        '& .MuiInputLabel-root': {
                            // Apply your label styles here
                            color: colors.grey[100], // Change the label color
                        },

                    }}
                />
            }
        />
    );
};

export default StockSelector;
