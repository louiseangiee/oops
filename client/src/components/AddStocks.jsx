import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import StockSelector from './StockSelectorDropdown';
import { getAsync, postAsync } from '../utils/utils';
import { useCookies } from 'react-cookie';
import { isAHoliday } from '@18f/us-federal-holidays';

function ButtonField(props) {
    const {
        setOpen,
        label,
        id,
        disabled,
        InputProps: { ref } = {},
        inputProps: { 'aria-label': ariaLabel } = {},
    } = props;
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Button
            variant="outlined"
            id={id}
            disabled={disabled}
            ref={ref}
            fullWidth
            aria-label={ariaLabel}
            onClick={() => setOpen?.((prev) => !prev)}
            sx={{ color: colors.grey[100], borderColor: colors.grey[500], marginBottom: "10px", marginTop: "10px" }}
        >
            {label ? `Buy date: ${label}` : 'Choose Buy Date'}
        </Button>
    );
}

function ButtonDatePicker(props) {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <DatePicker
            slots={{ field: ButtonField, ...props.slots }}
            slotProps={{ field: { setOpen } }}
            {...props}
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            sx={{
                '&.MuiButton-outlined': {
                    // Apply your button outline styles here
                    borderColor: colors.greenAccent[400], // Change the border color
                }
            }}
        />
    );
}

export default function AddStocks({ portfolioId }) {

    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [cookie] = useCookies()

    // Initialize state variables for form fields
    const [stockQuantity, setStockQuantity] = useState(0);
    const [stockPrice, setStockPrice] = useState(0);
    const [date, setDate] = useState(null);
    const [chosenStock, setChosenStock] = useState(null);
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = React.useState(false);

    const isWeekend = (date) => {
        const day = date.day();

        return day === 0 || day === 6;
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setDate(null);
    };

    const handleStockChange = async (newValue) => {
        setChosenStock(newValue ? newValue : null);
        if (newValue != null) {
            handleStockPriceChange(newValue.code, date);
        }
    };
    const handleStockPriceChange = async (symbol, date) => {
        if (date == null || chosenStock == null) return;
        else {
            setLoading(true);
            var dateChosen = date.format('YYYY-MM-DD');
            if (isAHoliday(new Date(dateChosen))) {
                alert("Stock market is closed on this date. Please choose another date.");
                setDate(null);
                setStockPrice(0);
            }
            const response = await getAsync(`stocks/priceAtDate?symbol=${symbol}&date=${dateChosen}`, cookie.accessToken);
            const data = await response.json();
            console.log(data);
            console.log(data["price"]);
            console.log(date.format('YYYY-MM-DD'));
            setStockPrice(data["price"]);
            setLoading(false);
            
        }
    }


    const handleAddClick = async () => {
        setLoading(true);
        const data = {
            "portfolioId": portfolioId,
            "symbol": chosenStock.code,
            "buyPrice": stockPrice,
            "quantity": stockQuantity,
            "buyDate": date.format('YYYY-MM-DD')
        }
        console.log(data);
        const response = await postAsync(`portfolioStocks/${portfolioId}`, data, cookie.accessToken);
        if (response.ok) {
            setLoading(false);
            alert("Stock added successfully!");
            handleClose();
        }
        else {
            alert("Failed to add stock. Please try again.")
            handleClose();
        }
    };

    return (
        <div>
            <Button
                sx={{
                    backgroundColor: colors.blueAccent[700],
                    color: colors.grey[100],
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                }}
                onClick={handleClickOpen}
            >
                <AddCircleOutlineIcon sx={{ mr: "10px" }} />
                Add Stocks
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle
                    sx={{
                        color: colors.greenAccent[600],
                        backgroundColor: colors.primary[400],
                        fontSize: "22px",
                        fontWeight: "bold",
                        textAlign: "center"
                    }}
                >
                    Add A Stock To This Portfolio
                </DialogTitle>
                <DialogContent
                    sx={{ backgroundColor: colors.primary[400] }}>
                    <Box
                        sx={{ width: '100%', marginTop: "10px", borderRadius: "5px" }}
                    >
                        <StockSelector
                            chosenStock={chosenStock}
                            handleStockChange={handleStockChange}
                        />
                    </Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <ButtonDatePicker
                            disableFuture
                            label={date == null ? null : date.format('DD-MM-YYYY')}
                            value={date}
                            shouldDisableDate={isWeekend}
                            onChange={(newValue) => { setDate(newValue); handleStockPriceChange(chosenStock.code, newValue); console.log(newValue); }}
                        />
                    </LocalizationProvider>
                    <TextField
                        margin="dense"
                        id="price"
                        InputProps={
                            { readOnly: true }
                        }
                        placeholder="e.g. 20"
                        startAdornment="$"
                        fullWidth
                        value={'Stock price: $' + stockPrice}
                        sx={{
                            color: colors.grey[100],
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

                    <TextField
                        autoFocus
                        margin="dense"
                        id="quantity"
                        label="Stock Quantity"
                        placeholder="e.g. 5"
                        type="number"
                        fullWidth
                        sx={{
                            color: colors.grey[100],
                            '& .MuiOutlinedInput-root': {
                                // Apply your input styles here
                                border: `2px solid colors.greenAccent[400]`, // Change the border color
                            },
                            '& .MuiInputLabel-root': {
                                // Apply your label styles here
                                color: colors.grey[100], // Change the label color
                            },

                        }}
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(e.target.value)}
                    />
                </DialogContent>
                <DialogActions sx={{ backgroundColor: colors.primary[400], paddingBottom: "20px", paddingRight: "20px" }}>
                    <Button onClick={handleClose} sx={{ color: colors.grey[300], fontWeight: "bold" }}>Cancel</Button>
                    <Button type="submit" sx={{ backgroundColor: colors.blueAccent[700], color: colors.grey[100], fontWeight: "bold" }} disabled={loading} onClick={handleAddClick}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}