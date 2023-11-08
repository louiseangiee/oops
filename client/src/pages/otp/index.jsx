import { useState, useRef } from "react";
import { Typography, Box, Button, useTheme, Link } from "@mui/material";
import { tokens } from '../../theme.js';
import { useLocation, useNavigate } from "react-router-dom";
import { getAsync } from "../../utils/utils";
import Grid from '@mui/material/Unstable_Grid2';
import { useCookies } from "react-cookie";


const OTP = () => {
    const theme = useTheme();
    const [, setCookie] = useCookies();
    const location = useLocation();
    const navigate = useNavigate();
    const locationData = location.state.data;
    const colors = tokens(theme.palette.mode);
    const [status, setStatus] = useState(''); // for displaying status of OTP verification
    const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6 digit OTP
    const inputRefs = useRef(
        Array(6).fill(null)
    ); // to store references to the 6 input fields

    const handleInputChange = (e, index) => {
        const value = e.target.value;
        if (/^[0-9]*$/.test(value) && value.length <= 1) {
            const otpCopy = [...otp];
            otpCopy[index] = value;
            setOtp(otpCopy);

            // focus on next input field
            if (index < 5 && value !== "" && inputRefs.current[index + 1]) {
                inputRefs.current[index + 1].focus();
            } else if (value === '' &&
                index > 0 &&
                inputRefs.current[index - 1]) {
                // if the user presses backspace and the input is empty, focus on the previous input
                inputRefs.current[index - 1].focus();
            }
        }
    }

    const setRequiredCookie = async () => {
        setCookie("accessToken", locationData.accessToken, { path: "/", maxAge: 86400 });
        setCookie("email", locationData.email, { path: "/", maxAge: 86400 });
    };

    const handleChangePassword = async () => {
        const response = await getAsync('api/v1/auth/forgotpassword?email=' + locationData.email + '&password=' + locationData.password);
        if (response.ok) {
            const data = await response.json();
            alert(data.message)
            navigate('/');
        }
        else {
            alert('Error changing password')
        }
    }

    const verifyOTP = async () => {
        const finalotp = otp.join('');
        const response = await getAsync('users/verifyOTP?email=' + locationData.email + '&otp=' + finalotp);
        if (response.ok) {
            if (locationData.password && !locationData.accessToken) {
                handleChangePassword();
            }
            else {
                const data = await response.text();
                if (data === '{"message": "OTP verified successfully"}') {
                    await setRequiredCookie();
                    navigate('/')
                } else {
                    alert('wrong code');
                }
            }
        }
        else {
            alert('error verifying')
        }
    }

    const generateOTP = async () => {
        const response = await getAsync('users/sendOTP?email=' + locationData.email);
        if (response.ok) {
            setStatus('OTP sent');
        }
        else {
            alert('Something went wrong')
        }
    }

    return (
        <main className="content">
            <Grid container sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <Box container>
                    <Typography variant="h1" sx={{ fontWeight: 'bold' }}>Enter code from your email</Typography>
                    <Typography variant="h5" sx={{ wordWrap: 'wrap' }}>We have sent an email to you. Please check your inbox and enter the code you receive to verify your email address.</Typography>
                    <Box mt={2} px={5}>
                        {otp.map((data, index) => {
                            return (
                                <input
                                    key={index}
                                    style={{
                                        height: '80px',
                                        width: '60px',
                                        fontSize: '32px',
                                        textAlign: 'center',
                                        border: '2px solid white',
                                        borderRadius: '3px',
                                        margin: '0 10px 0 0',
                                        backgroundColor: 'transparent',
                                        color: 'white'
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={data}
                                    onChange={(e) => handleInputChange(e, index)}
                                    ref={(ref) => inputRefs.current[index] = ref}
                                />
                            );
                        })}
                    </Box>
                    <Typography variant="h5" sx={{ wordWrap: 'wrap', mt: '20px' }}>Don't receive an email?
                        <Link ml={2} sx={{ wordWrap: 'wrap', mt: '10px', textDecoration: 'underline', cursor: 'pointer', ml: 2, color: 'white' }} onClick={generateOTP}>Resend OTP</Link>
                    </Typography>
                    <Typography variant="h5" sx={{ wordWrap: 'wrap', mt: '20px' }}>{status}</Typography>
                    <Button fullWidth sx={{
                        backgroundColor: "#326adf",
                        '&:hover': { backgroundColor: colors.blueAccent[700] },
                        color: colors.grey[100],
                        fontSize: "14px",
                        fontWeight: "bold",
                        padding: "10px 20px",
                        marginTop: "10px",
                    }}
                        onClick={verifyOTP}
                    > Verify OTP</Button>
                </Box>
            </Grid>
        </main >
    )
};
export default OTP;