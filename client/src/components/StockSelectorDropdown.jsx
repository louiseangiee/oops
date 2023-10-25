import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useCookies } from 'react-cookie';
import { getAsync } from '../utils/utils';

const StockSelector = (props) => {
    const { chosenStock, handleStockChange } = props;
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
                    label="Select Stock" 
                />
            }
        />
    );
};

export default StockSelector;
