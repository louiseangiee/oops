import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../theme.js';
import { Grid, Box, Button, useTheme, Typography, Link } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../context/AuthContext.jsx';
import Lottie from 'lottie-react';
import loadingLight from "../../components/lotties/loading_light.json"



const RegisterContainer = (props) => {
    const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$!%^&*()_+{}\]:;<>,.?~\\-]).{8,}$/;
    let navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const theme = useTheme();
    const { register } = useAuth();
    const colors = tokens(theme.palette.mode);

    async function handleRegister(e) {
        setIsLoading(true);
        e.preventDefault();
        await register(fullName, email, password)
        setIsLoading(false);
        navigate('/')
    }

    function checkPassword() {
        setPasswordError('');
        setIsDisabled(false);
        if (!(password.match(pattern)) && password.length > 0) {
            setPasswordError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
        }

        if (password.length < 8 && password.length > 0) {
            setPasswordError('Password must be at least 8 characters long');
        }
        if (password.length >= 25) {
            setPasswordError('Password must be less than 25 characters long');
        }

        if (password !== confirmPassword && confirmPassword.length > 0) {
            setPasswordError('Passwords do not match');
        }

        if (fullName.length === 0 || email.length === 0 || password.length === 0 || confirmPassword.length === 0) {
            setPasswordError('Please fill out all fields')
        }

        setIsDisabled(passwordError.length > 0)
    }

    useEffect(() => { checkPassword() }, [passwordError, password, confirmPassword, fullName, email]);
    return (
        <>
            <Grid item
                xs={12} md={4}
                id="registerContainer"
                sx={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', backgroundColor: 'white', height: '100%', width: '33%'
                }}
            >
                <Typography variant="h2" color={'black'} fontWeight="bold" sx={{ m: "0 0 5px 0" }}>Register An Account</Typography>
                <div>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'black', mb: 2 }}>
                        <AccountCircleIcon />
                        <InputBase sx={{ ml: 2, flex: 1, color: 'black', border: `1px solid ${colors.grey[100]}`, p: '5px 10px', borderRadius: '5px' }} placeholder="Full Name" required onChange={(e) => { setFullName(e.target.value); checkPassword() }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'black', mb: 2 }}>
                        <AlternateEmailIcon />
                        <InputBase sx={{ ml: 2, flex: 1, color: 'black', border: `1px solid ${colors.grey[100]}`, p: '5px 10px', borderRadius: '5px' }} placeholder="Email" type='email' required onChange={(e) => { setEmail(e.target.value); checkPassword() }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'black', mb: 2 }}>
                        <LockIcon />
                        <InputBase sx={{ ml: 2, flex: 1, color: 'black', border: `1px solid ${colors.grey[100]}`, p: '5px 10px', borderRadius: '5px' }} placeholder="Password" type={showPassword ? 'text' : 'password'} onChange={(e) => { setPassword(e.target.value); checkPassword() }} />
                        <Button
                            sx={{ color: colors.grey[100] }}
                            id="seePasswordBtn"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <VisibilityOffIcon style={{ color: 'black' }} /> : <VisibilityIcon style={{ color: 'black' }} />}
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'black', mb: 2 }}>
                        <LockIcon />
                        <InputBase sx={{ ml: 2, flex: 1, color: 'black', border: `1px solid ${colors.grey[100]}`, p: '5px 10px', borderRadius: '5px' }} placeholder="Confirm Password" type={showConfirmPassword ? 'text' : 'password'} onChange={(e) => { setConfirmPassword(e.target.value); checkPassword() }} />
                        <Button
                            sx={{ color: colors.grey[100] }}
                            id="seePasswordBtn"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <VisibilityOffIcon style={{ color: 'black' }} /> : <VisibilityIcon style={{ color: 'black' }} />}
                        </Button>
                    </Box>
                </div>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ wordWrap: 'break-word', maxWidth: '70%', color: colors.redAccent[500] }} mt={2}>{passwordError}</Typography>
                    <Typography variant="h6" mt={1} color={'black'}>Already have an account?</Typography>
                    <Typography variant="h6" mt={1} color={'black'}>
                        Login {" "}
                        <Link
                            onClick={props.handleSignIn}
                            sx={{ color: 'black', cursor: 'pointer' }}
                        >
                            here!
                        </Link>
                    </Typography>
                </Box>
                <Box sx={{ width: "60%" }}>
                    <Button
                        fullWidth
                        sx={{
                            backgroundColor: "#326adf",
                            '&:hover': { backgroundColor: colors.blueAccent[700] },
                            color: colors.grey[100],
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: isLoading ? 0 : "10px 20px",
                            marginTop: "10px",
                        }}
                        onClick={(e) => handleRegister(e)}
                        disabled={isDisabled || isLoading}
                    >
                        {isLoading ?
                            <Lottie
                                animationData={loadingLight}
                                loop={true} // Set to true for looping
                                autoplay={true} // Set to true to play the animation automatically
                                style={{ width: '50px', height: '50px', padding: 0 }} // Customize the dimensions
                            /> : <> Sign Up! </>}
                    </Button>
                </Box>
            </Grid >
        </>
    );
};

export default RegisterContainer;
