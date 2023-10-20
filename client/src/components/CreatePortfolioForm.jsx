import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { postAsync } from '../utils/utils';
import { useCookies } from "react-cookie";
import { useAuth } from "../context/AuthContext";
import InputAdornment from '@mui/material/InputAdornment';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';

export default function CreatePortfolio() {
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [cookie, removeCookie] = useCookies(["accessToken"]);
    const { userData } = useAuth();
    const [portfolioId, setPortfolioId] = useState(null);


    // Initialize state variables for form fields
    const [portfolioName, setPortfolioName] = useState('');
    const [portfolioDescription, setPortfolioDescription] = useState('');
    const [portfolioCapital, setPortfolioCapital] = useState(null);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCreate = () => {
        // Gather the form data (e.g., portfolio name, description, capital)
        const formData = {
            user: { id: userData.id }, // This is the user ID that we need to pass to the backend
            name: portfolioName,
            description: portfolioDescription,
            totalCapital: parseFloat(portfolioCapital), // Convert to a number
        };

        async function createPortfolio() {
            const response = await postAsync('portfolios', formData, cookie.accessToken);
            const data = await response.json();
            setPortfolioId(data["portfolioId"]);
            navigate("/portfolio/" + data["portfolioId"]);
            console.log(data);
        }

        createPortfolio();
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
                New Portfolio
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle
                    sx={{
                        color: colors.greenAccent[600],
                        backgroundColor: colors.primary[400],
                        fontSize: "22px",
                        fontWeight: "bold"
                    }}
                >
                    Create New Portfolio
                </DialogTitle>
                <DialogContent
                    sx={{ backgroundColor: colors.primary[400] }}>
                    <DialogContentText>
                        To create a new portfolio, please enter the portfolio name, description/strategy, and the capital.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Portfolio Name"
                        placeholder="e.g. Technology Stocks"
                        type="text"
                        fullWidth
                        variant="standard"
                        sx={{ color: colors.grey[100] }}
                        value={portfolioName}
                        onChange={(e) => setPortfolioName(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="desc"
                        label="Portfolio Description (Strategy)"
                        placeholder="e.g. All the technological stocks"
                        type="text"
                        fullWidth
                        variant="standard"
                        sx={{ color: colors.grey[100] }}
                        value={portfolioDescription}
                        onChange={(e) => setPortfolioDescription(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="capital"
                        label="Portfolio Capital"
                        placeholder="e.g. 1000"
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        type="number"
                        fullWidth
                        variant="standard"
                        sx={{ color: colors.grey[100] }}
                        value={portfolioCapital}
                        onChange={(e) => setPortfolioCapital(e.target.value)}
                    />
                </DialogContent>
                <DialogActions sx={{ backgroundColor: colors.primary[400], paddingBottom: "20px", paddingRight: "20px" }}>
                    <Button onClick={handleClose} sx={{ color: colors.grey[300], fontWeight: "bold" }}>Cancel</Button>
                    <Button type="submit" sx={{ backgroundColor: colors.blueAccent[700], color: colors.grey[100], fontWeight: "bold" }} onClick={handleCreate}>Create</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}