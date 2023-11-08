import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useTheme } from "@mui/material";
import { useCookies } from 'react-cookie';
import { getAsync } from '../utils/utils';
import { tokens } from '../theme';

const StockSelector = ({ chosenStock, handleStockChange }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [cookie] = useCookies();
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchStockData = async (search) => {
        if (!search.trim()) {
            setStocks([]);
            if (chosenStock) handleStockChange(null);
            return;
        }

        setLoading(true);
        try {
            const response = await getAsync(`stocks/search?searchTerm=${search}`, cookie.accessToken);
            setLoading(false);

            if (!response.ok) throw new Error('Could not load the stock data.');

            const data = await response.json();
            const formattedData = data.data
                .filter(stock => stock?.symbol && stock?.name)
                .map(stock => ({
                    code: stock.symbol,
                    name: `${stock.name} (${stock.symbol})`,
                }));

            setStocks(formattedData);
        } catch (err) {
            setLoading(false);
            setError('Error fetching stocks. Please try again.');
        }
    };

    const handleInputChange = (event, value, reason) => {
        if (reason === 'input') {
            fetchStockData(value);
        }
    };

    const handleChange = (event, newValue) => {
        const stockExists = stocks.some(stock => stock?.code === newValue?.code);
        handleStockChange(stockExists ? newValue : null);
    };

    return error ? (
        <div>{error}</div>
    ) : (
        <Autocomplete
            value={chosenStock}
            onInputChange={handleInputChange}
            onChange={handleChange}
            options={stocks}
            getOptionLabel={(option) => option.name || ''}
            isOptionEqualToValue={(option, value) => option !== null && value !== null && option.code === value.code}
            style={{ minWidth: 200, marginBottom: 20 }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label={loading ? "Loading..." : "Select Stock"}
                    sx={{
                        '& .MuiInputLabel-root': {
                            color: colors.grey[100],
                        },
                    }}
                />
            )}
        />
    );
};

export default StockSelector;
