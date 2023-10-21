import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const StockSelector = (props) => {
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
            isOptionEqualToValue={(option, value) => option.code === value.code} // Add this line
            style={{ minWidth: 200, marginBottom: 20 }}
            renderInput={(params) => 
                <TextField 
                    {...params} 
                    variant="outlined" 
                    label="Select Stock" 
                />
            }
        />







    );
};

export default StockSelector;
