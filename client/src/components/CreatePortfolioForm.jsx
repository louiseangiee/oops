import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from 'react-router-dom';
import { postAsync } from '../utils/utils';
import { useCookies } from "react-cookie";
import { useAuth } from "../context/AuthContext";
import InputAdornment from '@mui/material/InputAdornment';
import loadingLight from "./lotties/loading_light.json";
import Lottie from 'lottie-react';

export default function CreatePortfolio() {
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [cookie] = useCookies();
    const { userData } = useAuth();
    const [capitalError, setCapitalError] = useState(false);
    const [loading, setLoading] = useState(false); // Add a loading state


    // Initialize state variables for form fields
    const [portfolioName, setPortfolioName] = useState('');
    const [portfolioDescription, setPortfolioDescription] = useState('');
    const [portfolioCapital, setPortfolioCapital] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    useEffect(() => {
        const decimalRegex = /^\d+(\.\d{2})?$/;
        const validCapital = decimalRegex.test(portfolioCapital) && parseFloat(portfolioCapital) > 0;
    
        setCapitalError(!validCapital);
        setIsButtonDisabled(!validCapital || !portfolioName || !portfolioDescription);
    
    }, [portfolioCapital, portfolioName, portfolioDescription]);
    
    const handleCreate = () => {
        setLoading(true);
        const formData = {
            user: { id: userData.id }, // This is the user ID that we need to pass to the backend
            name: portfolioName,
            description: portfolioDescription,
            totalCapital: parseFloat(portfolioCapital).toFixed(2), // Convert to a number
            remainingCapital: parseFloat(portfolioCapital).toFixed(2), // Convert to a number
        };
        setLoading(true);
        async function createPortfolio() {
            const response = await postAsync('portfolios', formData, cookie.accessToken);
            const data = await response.json();
            if (response.ok) {
                setLoading(false);
                navigate("/portfolio/" + data["portfolioId"]);
            } else {
                setLoading(false);
                setOpen(false);
                return;
            }

        }

        createPortfolio();
    };

    const handleCapitalChange = (e) => {
        let value = e.target.value;
        // If the input is not a number, reset it to the last valid value
        if (isNaN(value)) {
            value = portfolioCapital;
        }
        // If there are more than two digits after a decimal point, fix to two
        if (value.includes('.') && value.split('.')[1].length > 2) {
            value = parseFloat(value).toFixed(2);
        }
        setPortfolioCapital(value);
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
                            step: "0.01",
                        }}
                        type="number"
                        fullWidth
                        variant="standard"
                        sx={{ color: colors.grey[100] }}
                        value={portfolioCapital}
                        onChange={handleCapitalChange}
                        error={capitalError}
                        helperText={capitalError ? 'Invalid capital value. Capital must be up to 2 decimal points and must be more than $0.00' : ''}
                    />
                </DialogContent>
                <DialogActions sx={{ backgroundColor: colors.primary[400], paddingBottom: "30px", paddingRight: "20px" }}>
                    <Button onClick={handleClose} sx={{ color: colors.grey[300], fontWeight: "bold" }}>Cancel</Button>
                    <Button
                        type="submit"
                        sx={{
                            backgroundColor: loading ? colors.greenAccent[600] : colors.blueAccent[700],
                            color: colors.grey[100],
                            fontWeight: "bold",
                            width: "80px",
                            height: "40px",
                            ":hover": { backgroundColor: colors.greenAccent[600] }
                        }}
                        onClick={handleCreate}
                        disabled={isButtonDisabled}
                    >
                        {loading ?
                            <Lottie
                                animationData={loadingLight}
                                loop={true}
                                autoplay={true}
                                style={{ width: '80px', height: '80px' }}
                            />
                            :
                            "Create"
                        }
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}