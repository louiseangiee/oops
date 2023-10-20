import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { tokens } from '../../theme.js';
import { Grid, Box, Button, useTheme, Typography, Link } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { getAsync } from "../../utils/utils";
import { useCookies } from "react-cookie";


const SignInContainer = (props) => {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [open, setOpen] = useState(false);
    const [emailState, setEmailState] = useState("");
    const [otp, setOtp] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSignIn = async () => {
        await signIn(email, password);
        navigate('/')
    }

    const generateOTP = async () => {
        const response = await getAsync('users/sendOTP?email=' + email);
        if (response.ok) {
            setEmailState("Email has been sent");
        }
    }

    const verifyOTP = async () => {
        const response = await getAsync('users/verifyOTP?email=' + email + '&otp=' + otp);
        if (response.ok) {
            const data = await response.json();
            data ? handleSignIn() : alert('wrong code');
        }
        else {
            alert('error verifying')
        }
    }

    return (
        <>
            <Grid item
                xs={12} md={8}
                id="signInContainer"
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
            >
                <Typography variant="h2" color={colors.grey[100]} fontWeight="bold" sx={{ m: "0 0 5px 0" }}>Sign In With Password</Typography>
                <div>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AlternateEmailIcon />
                        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Email" type='email' required onChange={(e) => { setEmail(e.target.value) }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LockIcon />
                        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Password" type={showPassword ? 'text' : 'password'} onChange={(e) => setPassword(e.target.value)} />
                        <Button
                            sx={{ color: colors.grey[100] }}
                            id="seePasswordBtn"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </Button>
                    </Box>
                </div>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h6" mt={1}>Don't have an account?</Typography>
                    <Typography variant="h6" mt={1}>
                        Register with us {" "}
                        <Link
                            onClick={props.handleSignIn}
                            sx={{ color: colors.grey[100], cursor: 'pointer' }}
                        >
                            here!
                        </Link>
                    </Typography>
                </Box>
                <Button sx={{ color: colors.grey[100], width: '100%' }} onClick={handleClickOpen}>Sign In</Button>
            </Grid >

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle
                    sx={{
                        color: colors.greenAccent[600],
                        backgroundColor: colors.primary[400],
                        fontSize: "22px",
                        fontWeight: "bold"
                    }}
                >
                    Make sure that it's you!
                </DialogTitle>
                <DialogContent
                    sx={{ backgroundColor: colors.primary[400] }}>
                    <DialogContentText>
                        Please check your email for OTP
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="otp"
                        label=""
                        placeholder="Fill in OTP here"
                        startAdornment="$"
                        type="text"
                        fullWidth
                        variant="standard"
                        sx={{ color: colors.grey[100] }}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <Typography sx={[{
                        '&:hover': {
                            textDecoration: 'underline',
                        },
                    }, { marginTop: "10px", cursor: 'pointer' }]} onClick={generateOTP}>Generate OTP</Typography>
                    <Typography>{emailState}</Typography>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: colors.primary[400], paddingBottom: "20px", paddingRight: "20px" }}>
                    <Button onClick={handleClose} sx={{ color: colors.grey[300], fontWeight: "bold" }}>Cancel</Button>
                    <Button type="submit" sx={{ backgroundColor: colors.blueAccent[700], color: colors.grey[100], fontWeight: "bold" }} onClick={verifyOTP}>Verify OTP</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SignInContainer;
