import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../theme.js';
import { Grid, Box, Button, useTheme, Typography, Link } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';



const RegisterContainer = (props) => {
    let navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    var today = new Date();
    var dd = today.getDate();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var maxDate = yyyy + '-' + mm + '-' + dd;

    return (
        <>
            <Grid
                xs={6}
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
                        <CalendarTodayIcon />
                        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Date of Birth" type='date' maxDate={maxDate} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LockIcon />
                        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Password" type={showPassword ? 'text' : 'password'} />
                        <Button
                            sx={{ color: colors.primary[300] }}
                            id="seePasswordBtn"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LockIcon />
                        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Confirm Password" type='password' />
                    </Box>
                </div>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h6" mt={1}>Already have an account?</Typography>
                    <Typography variant="h6" mt={1}>
                        Login {" "}
                        <Link
                            onClick={props.handleSignIn}
                            sx={{ color: colors.primary[300], cursor: 'pointer' }}
                        >
                            here!
                        </Link>
                    </Typography>
                </Box>
                <Button
                    sx={{ color: colors.primary[300], width: '100%' }}
                    onClick={() => navigate('/')}
                >
                    Sign Up!
                </Button>
            </Grid >
        </>
    );
};

export default RegisterContainer;
