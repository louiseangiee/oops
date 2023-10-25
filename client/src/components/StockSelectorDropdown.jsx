import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { tokens } from "../theme";
import { useTheme } from "@mui/material";

const StockSelector = (props) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { chosenStock, handleStockChange } = props;

    const stocks = [
        { code: 'AAPL', name: 'Apple Inc. (AAPL)' },
        { code: 'AMZN', name: 'Amazon.com, Inc. (AMZN)' },
        { code: 'TSLA', name: 'Tesla Inc. (TSLA)' },
        // You can dynamically fetch and add more stocks from your DB
    ];

    console.log("Chosen Stock:", chosenStock);
    console.log("Stock Options:", stocks);

    return (
        <Autocomplete
            value={chosenStock}
            onChange={(event, newValue) => {
                // Check if newValue is not null and exists in the options before passing it to the handler
                const stockExists = stocks.some(stock => stock.code === (newValue && newValue.code));
                handleStockChange(stockExists ? newValue : null);
            }}
            options={stocks}
            getOptionLabel={(option) => option.name}
            sx={{}}
            style={{ minWidth: 200, marginBottom: 20 }}
            renderInput={(params) =>
                <TextField
                    {...params}
                    variant="outlined"
                    label="Select Stock"
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
