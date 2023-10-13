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

const SignInContainer = (props) => {
    const { signIn, userEmail } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault()
        await signIn(email, password)
        navigate('/')
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
                <Button sx={{ color: colors.grey[100], width: '100%' }} onClick={handleSignIn}>Sign In</Button>
            </Grid >
        </>
    );
};

export default SignInContainer;
