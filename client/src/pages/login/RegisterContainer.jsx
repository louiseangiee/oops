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



const RegisterContainer = (props) => {
    const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$!%^&*()_+{}\]:;<>,.?~\\-]).{8,}$/;
    let navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    // var today = new Date();
    // var dd = today.getDate();
    // var mm = String(today.getMonth() + 1).padStart(2, '0');
    // var yyyy = today.getFullYear();
    // var maxDate = yyyy + '-' + mm + '-' + dd;

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

        setIsDisabled(passwordError.length > 0 || !(confirmPassword.length > 0) || !(password.length > 0))

    }

    useEffect(() => {
        checkPassword();
    }, [password, confirmPassword]);

    return (
        <>
            <Grid item
                xs={12} md={8}
                id="registerContainer"
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
            >
                <Typography variant="h2" color={colors.grey[100]} fontWeight="bold" sx={{ m: "0 0 5px 0" }}>Register An Account</Typography>
                <div>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccountCircleIcon />
                        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Full Name" required />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AlternateEmailIcon />
                        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Email" type='email' required />
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
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LockIcon />
                        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Confirm Password" type={showConfirmPassword ? 'text' : 'password'} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <Button
                            sx={{ color: colors.grey[100] }}
                            id="seePasswordBtn"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </Button>
                    </Box>
                </div>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ wordWrap: 'break-word', maxWidth: '70%', color: colors.redAccent[500] }} mt={2}>{passwordError}</Typography>
                    <Typography variant="h6" mt={1}>Already have an account?</Typography>
                    <Typography variant="h6" mt={1}>
                        Login {" "}
                        <Link
                            onClick={props.handleSignIn}
                            sx={{ color: colors.grey[100], cursor: 'pointer' }}
                        >
                            here!
                        </Link>
                    </Typography>
                </Box>
                <Button
                    sx={{ color: colors.grey[100], width: '100%' }}
                    onClick={() => navigate('/')}
                    disabled={isDisabled}
                >
                    Sign Up!
                </Button>
            </Grid >
        </>
    );
};

export default RegisterContainer;
