import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { putAsync } from '../utils/utils';
import { useCookies } from "react-cookie";

export default function EditPortfolio({ portfolioId, small }) {
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Initialize state variables for form fields
    const [portfolioName, setPortfolioName] = useState('');
    const [portfolioDescription, setPortfolioDescription] = useState('');
    const [portfolioCapital, setPortfolioCapital] = useState('');
    const [cookie, removeCookie] = useCookies(["accessToken"]);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChanges = () => {
        // Gather the form data (e.g., portfolio name, description, capital)
        const formData = {
            'user': { 'id': 1 }, // This is the user ID that we need to pass to the backend
            'portfolioId': portfolioId, // This is the portfolio ID that we need to pass to the backend
            "name": portfolioName,
            "description": portfolioDescription,
            "totalCapital": parseFloat(portfolioCapital), // Convert to a number
        };
        console.log(formData);
        // async function editPortfolio() {
        //     const response = await putAsync('portfolios', formData, cookie.accessToken);
        //     const data = await response.json();
        //     console.log(data);
        // }

    };

    return (
        <div>
            <EditOutlinedIcon onClick={handleClickOpen} sx={{ color: colors.greenAccent[600], fontSize: (small ? "20px" : "35px") }} />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle
                    sx={{
                        color: colors.greenAccent[600],
                        backgroundColor: colors.primary[400],
                        fontSize: "22px",
                        fontWeight: "bold"
                    }}
                >
                    Edit This Portfolio
                </DialogTitle>
                <DialogContent
                    sx={{ backgroundColor: colors.primary[400] }}>
                    {/* <DialogContentText>
                        To create a new portfolio, please enter the portfolio name, description/strategy, and the capital.
                    </DialogContentText> */}
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
                        InputProps={{
                            classes: {
                                notchedOutline: 'portfolio-name-outline',
                            },
                        }}
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
                        startAdornment="$"
                        type="number"
                        fullWidth
                        variant="standard"
                        sx={{ color: colors.grey[100] }}
                        value={portfolioCapital}
                        onChange={(e) => setPortfolioCapital(e.target.value)}
                    />
                    <style jsx>{`
                        .portfolio-name-outline {
                            color: ${colors.greenAccent[800]} !important;
                            border-color: ${colors.greenAccent[800]} !important;
                        }

                    `}</style>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: colors.primary[400], paddingBottom: "20px", paddingRight: "20px" }}>
                    <Button onClick={handleClose} sx={{ color: colors.grey[300], fontWeight: "bold" }}>Cancel</Button>
                    <Button type="submit" sx={{ backgroundColor: colors.blueAccent[700], color: colors.grey[100], fontWeight: "bold" }} onClick={handleChanges}>Confirm Changes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}