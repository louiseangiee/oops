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
import { getAsync } from "../../utils/utils";
import Lottie from 'lottie-react';
import loadingLight from "../../components/lotties/loading_light.json"

const SignInContainer = (props) => {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();


    const handleSignIn = async () => {
        setIsLoading(true);
        const response = await signIn(email, password);
        if (response != null) {
            generateOTP(response);
        }
        else {
            alert("Wrong email or password");
            setIsLoading(false);
        }
    }

    const generateOTP = async (data) => {
        const response = await getAsync('users/sendOTP?email=' + email);
        if (response.ok) {
            setIsLoading(false);
            navigate('/otp', { state: { data: data } })
        }
        else {
            alert('Email not found')
        }
    }


    return (
        <>
            <Grid item
                xs={12} md={4}
                id="signInContainer"
                sx={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', backgroundColor: 'white', height: '100%', width: '33%'
                }}
            >
                <Typography variant="h2" color={'black'} fontWeight="bold" sx={{ m: "0 0 5px 0" }}>Sign in with Password</Typography>
                <div>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'black', mb: 2 }}>
                        <AlternateEmailIcon />
                        <InputBase sx={{ ml: 2, flex: 1, color: 'black', border: `1px solid ${colors.grey[100]}`, p: '5px 10px', borderRadius: '5px' }} placeholder="Email" type='email' required onChange={(e) => { setEmail(e.target.value) }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'black' }}>
                        <LockIcon />
                        <InputBase sx={{ ml: 2, flex: 1, color: 'black', border: `1px solid ${colors.grey[100]}`, p: '5px 10px', borderRadius: '5px' }} placeholder="Password" type={showPassword ? 'text' : 'password'} onChange={(e) => setPassword(e.target.value)} />
                        <Button
                            sx={{ color: colors.grey[100] }}
                            id="seePasswordBtn"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <VisibilityOffIcon style={{ color: 'black' }} /> : <VisibilityIcon style={{ color: 'black' }} />}
                        </Button>
                    </Box>
                </div>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'black' }}>
                    <Typography variant="h6" mt={1} color={'black'}>Don't have an account?</Typography>
                    <Typography variant="h6" mt={1} color={'black'}>
                        Register with us {" "}
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
                        disabled={isLoading}
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
                        onClick={handleSignIn}>
                        {isLoading ?
                            <Lottie
                                animationData={loadingLight}
                                loop={true} // Set to true for looping
                                autoplay={true} // Set to true to play the animation automatically
                                style={{ width: '50px', height: '50px', padding: 0 }} // Customize the dimensions
                            /> : <> Sign In </>}
                    </Button>
                </Box>
            </Grid >
        </>
    );
};

export default SignInContainer;
