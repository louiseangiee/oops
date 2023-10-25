import { useState } from "react";
import SignInContainer from "./SignInContainer";
import { tokens } from '../../theme.js';
import RegisterContainer from "./RegisterContainer";
import { useTheme, Typography, Box } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';

const Login = () => {
    const [showSignIn, setShowSignIn] = useState(true);
    const theme = useTheme();

    const handleSignIn = () => {
        setShowSignIn(!showSignIn);
    };


    // ../../Goldman_Sachs_Logos/logos_for_screen/GS_logo_PNG/Goldman_Sachs_Signature.png

    return (
        <main className="content">
            <Grid container sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={'../../Goldman_Sachs_Logos/logos_for_screen/GS_logo_PNG/Goldman_Sachs_Signature_Reverse.png'} alt="gs-logo" style={{ cursor: "pointer", width: "8%", height: "8%", position: "absolute", top: "40px", left: "40px" }} />
                <Grid item md={8} id="welcomeGoldman" height={"100%"} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box height={"40%"} width={"40%"} sx={{ backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: "20px" }}>
                        <Typography variant="h1" sx={{ fontWeight: 'bold', color: 'black' }}>INVEST.</Typography>
                        <img
                            alt="invest"
                            src={`../../invest.png`}
                            style={{ cursor: "pointer", width: "60%", height: "60%" }}
                        />
                    </Box>


                    {/* <Typography sx={{ fontStyle: 'italic' }}>
                        Providing sustainable growth opportunities to businesses and customers
                    </Typography> */}
                </Grid>
                {showSignIn ? (
                    <SignInContainer handleSignIn={handleSignIn} />
                ) : (
                    <RegisterContainer handleSignIn={handleSignIn} />
                )}
            </Grid >
        </main>
    )
};
export default Login;