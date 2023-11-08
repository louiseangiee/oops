import { useState, useEffect } from 'react';
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

const ForgotPasswordContainer = (props) => {
  const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$!%^&*()_+{}\]:;<>,.?~\\-]).{8,}$/;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);



  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const handleForgetPassword = () => {
    setIsLoading(true);
    generateOTP({ password: password, email: email });
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

    if (email.length === 0 || password.length === 0) {
      setPasswordError('Please fill out all fields')
    }


    setIsDisabled(passwordError.length > 0)
  }

  useEffect(() => { checkPassword() }, [passwordError, password, email]);

  return (
    <>
      <Grid item
        xs={12} md={4}
        id="signInContainer"
        sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', backgroundColor: 'white', height: '100%', width: '33%'
        }}
      >
        <Typography variant="h2" color={'black'} fontWeight="bold" sx={{ m: "0 0 5px 0" }}>Forget Password</Typography>
        <div>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'black', mb: 1 }}>
            <AlternateEmailIcon />
            <InputBase sx={{ ml: 2, flex: 1, color: 'black', border: `1px solid ${colors.grey[100]}`, p: '5px 10px', borderRadius: '5px' }} placeholder="Email" type='email' required onChange={(e) => { setEmail(e.target.value); checkPassword() }} />
          </Box>
          <Typography variant="h6" color={'black'} textAlign={'left'} mb={1}>Key in your new password</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'black' }}>
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
        </div>
        <Box sx={{ width: "60%" }}>
          <Button
            disabled={isDisabled || isLoading}
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
            onClick={handleForgetPassword}>
            {isLoading ?
              <Lottie
                animationData={loadingLight}
                loop={true}
                autoplay={true}
                style={{ width: '50px', height: '50px', padding: 0 }}
              /> : <> Change Password </>}
          </Button>
        </Box>
        <Box>

        </Box>

      </Grid >
    </>
  );
};

export default ForgotPasswordContainer;
