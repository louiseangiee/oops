import { useState } from "react";
import SignInContainer from "./SignInContainer";
import { tokens } from '../../theme.js';
import RegisterContainer from "./RegisterContainer";
import { useTheme, Typography } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';

const Login = () => {
    const [showSignIn, setShowSignIn] = useState(true);
    const theme = useTheme();

    const handleSignIn = () => {
        setShowSignIn(!showSignIn);
    };

    return (
        <>
            <Grid container sx={{ height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} spacing={2}>
                <Grid item md={4} id="welcomeGoldman">
                    <img
                        alt="goldman-logo"
                        width="100px"
                        height="45px"
                        src={theme.palette.mode === 'dark' ? `../../Goldman_Sachs_Logos/logos_for_screen/GS_logo_PNG/Goldman_Sachs_Signature_Reverse.png` : `../../Goldman_Sachs_Logos/logos_for_screen/GS_logo_PNG/Goldman_Sachs_Signature.png`}
                        style={{ cursor: "pointer" }}
                    />
                    <Typography variant="h1" sx={{ fontWeight: 'bold' }}>Welcome to Goldman Sachs</Typography>
                    <Typography sx={{ fontStyle: 'italic' }}>
                        Providing sustainable growth opportunities to businesses and customers
                    </Typography>
                </Grid>
                {showSignIn ? (
                    <SignInContainer handleSignIn={handleSignIn} />
                ) : (
                    <RegisterContainer handleSignIn={handleSignIn} />
                )}
            </Grid>
        </>
    )
};
export default Login;