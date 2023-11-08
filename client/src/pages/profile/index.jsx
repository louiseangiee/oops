import { useState } from 'react';
import Topbar from '../global/Topbar';
import { Box, Typography, useTheme, TextField, Button, Tooltip, Snackbar, Alert } from "@mui/material";
import { tokens } from "../../theme";
import { putAsync } from "../../utils/utils";
import { useCookies } from "react-cookie";
import { useEffect } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


export default function Profile() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [email, setEmail] = useState("Fetching email...");
    const [fullName, setFullName] = useState("Fetching name...");
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [cookie, removeCookie] = useCookies();
    const [dataFetched, setDataFetched] = useState({});
    const [isErrorAlertOpen, setIsErrorAlertOpen] = useState(false);
    const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);



    const { userData } = useAuth();

    useEffect(() => {
        setEmail(userData.email);
        setFullName(userData.fullName);
        setDataFetched(userData);
    }, [userData]);


    const handleCloseErrorAlert = () => {
        setIsErrorAlertOpen(false);
    };

    const handleCloseSuccessAlert = () => {
        setIsSuccessAlertOpen(false);
    };

    const handleEditName = () => {
        setIsEditingName(true);
    };

    /**
     * The `handleSaveName` function updates the user's full name in the database and handles any errors
     * that occur during the process.
     * @returns The function does not explicitly return anything.
     */
    const handleSaveName = async () => {
        setIsEditingName(false);
        const trimmedFullName = fullName.trim();

        if (trimmedFullName === '') {
            setIsErrorAlertOpen(true);
            handleCancelName();
            return;
        }

        const updatedData = {
            ...dataFetched,
            fullName: trimmedFullName,
        };
        try {
            const response = await putAsync('api/users', updatedData, cookie.accessToken);

            if (response.ok) {
                setIsSuccessAlertOpen(true);
            } else {
                console.error('Full name update failed');
                const errorResponse = await response.json();
                console.error('Error Response:', errorResponse);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCancelName = () => {
        setFullName(dataFetched.fullName);
        setIsEditingName(false);
    };
    return (
        <>
            <main className="content">
                {/* Snackbar for error message */}
                <Snackbar
                    open={isErrorAlertOpen}
                    autoHideDuration={5000}
                    onClose={handleCloseErrorAlert}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert
                        elevation={6}
                        variant="filled"
                        severity="error"
                        onClose={handleCloseErrorAlert}
                        sx={{ backgroundColor: colors.redAccent[600] }}
                    >
                        Full name <strong>cannot</strong> be empty.
                    </Alert>
                </Snackbar>

                {/* Snackbar for success message */}
                <Snackbar
                    open={isSuccessAlertOpen}
                    autoHideDuration={5000}
                    onClose={handleCloseSuccessAlert}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert
                        elevation={6}
                        severity="success"
                        onClose={handleCloseErrorAlert}
                        sx={{ backgroundColor: colors.greenAccent[700] }}
                    >
                        Full name is updated <strong>successfully</strong>.
                    </Alert>
                </Snackbar>

                {/* <Topbar invisible={false} /> */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Box width="60%" m="100px">
                        <Typography variant="h1" fontWeight="bold">Profile</Typography>
                        {/* Full Name */}
                        <Box m="20px" display="flex" alignItems="center">
                            <Typography
                                variant="h5"
                                mr="10px"
                                style={{
                                    width: '100px',
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                }}>
                                Full Name
                            </Typography>
                            <Typography
                                id="fullName"
                                style={{
                                    flex: 1,
                                    marginLeft: '20px',

                                }}
                                size="small"
                                fullWidth
                            >{fullName}</Typography>
                        </Box>

                        <Box m="20px" display="flex" alignItems="center">
                            <Typography
                                variant="h5"
                                mr="10px"
                                style={{
                                    width: '100px',
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0, // Prevent label from shrinking
                                }}>
                                Email
                            </Typography>
                            <Typography
                                id="fullName"
                                style={{
                                    flex: 1,
                                    marginLeft: '20px',

                                }}
                                size="small"
                                fullWidth
                            >{email}</Typography>
                        </Box>
                        <Box m="20px" display="flex" alignItems="center">

                            <Typography
                                variant="h5"
                                mr="10px"
                                style={{
                                    width: '100px',
                                    whiteSpace: 'nowrap', // Prevent label from wrapping
                                    flexShrink: 0, // Prevent label from shrinking
                                }}>
                                Portfolio Count
                            </Typography>
                            <Typography
                                id="fullName"
                                style={{
                                    flex: 1,
                                    marginLeft: '20px',

                                }}
                                size="small"
                                fullWidth
                            >{dataFetched?.portfolios?.length}</Typography>
                        </Box>

                        {/* Logout Button */}
                        <Box m="20px" mt="80px" display="flex" alignItems="center" justifyContent="center">
                            <Button sx={{
                                backgroundColor: 'transparent',
                                border: "2px solid",
                                borderColor: colors.redAccent[700],
                                color: colors.grey[100],
                                fontSize: "14px",
                                fontWeight: "bold",
                                padding: "10px 20px",
                                '&:hover': {
                                    backgroundColor: colors.redAccent[700],
                                },
                                width: "30%"
                            }} onClick={() => { removeCookie("accessToken", ''); removeCookie("email", ''); navigate('/login') }}>
                                Log Out
                            </Button>
                        </Box>
                    </Box>
                </div>
            </main >
        </>
    );
}