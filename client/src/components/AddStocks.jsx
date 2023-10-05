import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

export default function AddStocks() {
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Initialize state variables for form fields
    const [stockQuantity, setStockQuantity] = useState(0);
    const [stockPrice, setStockPrice] = useState(0);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddClick = () => {
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
                    {/* SEARCH BAR */}
                    <Box
                        display="flex"
                        backgroundColor={colors.primary[500]}
                        borderRadius="3px"
                    >
                        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
                        <IconButton type="button" sx={{ p: 1 }}>
                            <SearchIcon />
                        </IconButton>
                    </Box>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="price"
                        label="Stock Price"
                        placeholder="e.g. 20"
                        startAdornment="$"
                        type="number"
                        fullWidth
                        variant="standard"
                        sx={{ color: colors.grey[100] }}
                        value={stockPrice}
                        onChange={(e) => setStockPrice(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="quantity"
                        label="Stock Quantity"
                        placeholder="e.g. 5"
                        type="number"
                        fullWidth
                        variant="standard"
                        sx={{ color: colors.grey[100] }}
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(e.target.value)}
                    />
                </DialogContent>
                <DialogActions sx={{ backgroundColor: colors.primary[400], paddingBottom: "20px", paddingRight: "20px"}}>
                    <Button onClick={handleClose} sx={{ color: colors.grey[300], fontWeight: "bold" }}>Cancel</Button>
                    <Button type="submit" sx={{ backgroundColor: colors.blueAccent[700], color: colors.grey[100], fontWeight: "bold"}} onClick={handleAddClick}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}