import { useState } from 'react';
import Topbar from '../global/Topbar';
import { Box, Typography, useTheme, TextField, Button, Tooltip, Snackbar, Alert } from "@mui/material";
import { tokens } from "../../theme";
import { getAsync, putAsync } from "../../utils/utils";
import { useCookies } from "react-cookie";
import { useEffect } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [isFullNameEmpty, setIsFullNameEmpty] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [cookie, removeCookie] = useCookies(["accessToken"]);
    const [dataFetched, setDataFetched] = useState({});
    const [isErrorAlertOpen, setIsErrorAlertOpen] = useState(false);
    const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const response = await getAsync('api/users/1', cookie.accessToken);
            const data = await response.json();
            setFullName(data['fullName']);
            setEmail(data['email']);
            setDataFetched(data);
        }

        fetchData();
    }, [email, cookie.accessToken]);

    const handleCloseErrorAlert = () => {
        setIsErrorAlertOpen(false);
    };

    const handleCloseSuccessAlert = () => {
        setIsSuccessAlertOpen(false);
    };


    const handleEditName = () => {
        setIsEditingName(true);
    };

    const handleSaveName = async () => {
        setIsEditingName(false);

        // Trim the input to remove leading/trailing whitespace
        const trimmedFullName = fullName.trim();

        if (trimmedFullName === '') {
            // Display an error message or provide feedback to the user
            console.log('Full name cannot be empty.');
            setIsErrorAlertOpen(true);
            handleCancelName();
            return; // Prevent further processing
        }

        const updatedData = {
            id: dataFetched.id,
            email: dataFetched.email,
            password: dataFetched.password,
            role: dataFetched.role,
            fullName: trimmedFullName, // Assuming fullName is defined in your component state
        };
        console.log(updatedData);
        console.log(JSON.stringify(updatedData))
        // Make an API call to save the updated name
        try {
            const response = await putAsync('api/users', updatedData, cookie.accessToken);

            if (response.ok) {
                // User data updated successfully
                // You can add further logic or state updates here if needed
                setIsSuccessAlertOpen(true);
                console.log('Full name updated successfully');
            } else {
                // Handle the case where the update failed
                // You can log the response or show an error message to the user
                console.error('Full name update failed');
                const errorResponse = await response.json();
                console.error('Error Response:', errorResponse);
            }
        } catch (error) {
            // Handle any network errors
            console.error('Error:', error);
        }
    };

    const handleCancelName = () => {
        // Revert the 'fullName' field to its original value
        setFullName(dataFetched.fullName);

        // Exit the edit mode
        setIsEditingName(false);
    };

    const handleEditEmail = () => {
        setIsEditingEmail(true);
    };

    const handleSaveEmail = async () => {
        setIsEditingEmail(false);
        const updatedData = {
            id: dataFetched.id,
            email: email, // Assuming email is defined in your component state
            password: dataFetched.password,
            role: dataFetched.role,
            fullName: dataFetched.fullName,
        };
        // Make an API call to save the updated email
        try {
            const response = await putAsync('api/users', updatedData, cookie.accessToken);

            if (response.ok) {
                // User data updated successfully
                // You can add further logic or state updates here if needed
                console.log('Email updated successfully');
            } else {
                // Handle the case where the update failed
                // You can log the response or show an error message to the user
                console.error('Email update failed');
            }
        } catch (error) {
            // Handle any network errors
            console.error('Error:', error);
        }
    };

    return (
        <>
            <main className="content">
                {/* Snackbar for error message */}
                <Snackbar
                    open={isErrorAlertOpen}
                    autoHideDuration={5000} // Adjust the duration as needed
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
                    autoHideDuration={5000} // Adjust the duration as needed
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

                <Topbar visible={false} />
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
                                    width: '100px', // Set a fixed width for the label
                                    whiteSpace: 'nowrap', // Prevent label from wrapping
                                    flexShrink: 0, // Prevent label from shrinking
                                }}>
                                Full Name
                            </Typography>
                            {isEditingName ? (
                                <>
                                    <TextField
                                        id="fullName"
                                        style={{
                                            flex: 1,
                                            marginRight: '10px',
                                            // borderColor: isEditingName ? colors.primary[400] : colors.grey[100],
                                        }}
                                        value={fullName}
                                        InputProps={{
                                            readOnly: !isEditingName, // Make it read-only when not editing
                                            classes: {
                                                notchedOutline: 'editing-name-outline',
                                            },
                                        }}
                                        onChange={(e) => {
                                            setFullName(e.target.value);
                                        }}
                                        size="small"
                                        fullWidth
                                        focused
                                    />
                                    <Tooltip title="Cancel Changes">
                                        <HighlightOffOutlinedIcon onClick={handleCancelName} sx={{ marginRight: "10px", color: colors.redAccent[600] }} />
                                    </Tooltip>
                                    <Tooltip title="Save Changes">
                                        <SaveOutlinedIcon onClick={handleSaveName} sx={{ color: colors.greenAccent[600] }} />
                                    </Tooltip>
                                    <style jsx>{`
                                        .editing-name-outline {
                                            border-color: ${colors.greenAccent[800]} !important;
                                            
                                        }
                                    `}</style>
                                </>
                            ) : (
                                <>
                                    <TextField
                                        id="fullName"
                                        style={{
                                            flex: 1,
                                            marginRight: '10px',

                                        }}
                                        value={fullName}
                                        InputProps={{
                                            readOnly: true,
                                            classes: {
                                                notchedOutline: 'read-name-outline',
                                            },
                                        }}
                                        size="small"
                                        fullWidth
                                    />
                                    <Tooltip title="Edit">
                                        <EditOutlinedIcon onClick={handleEditName} />
                                    </Tooltip>

                                    <style jsx>{`
                                        .read-name-outline {
                                            border-color: ${colors.grey[600]} !important;
                                            
                                        }
                                    `}</style>
                                </>
                            )}
                        </Box>

                        {/* Email --> needs confirmation to change email */}
                        {/* <Box m="20px" display="flex" alignItems="center">
                            <Typography
                                variant="h5"
                                mr="10px"
                                style={{
                                    width: '100px', // Set a fixed width for the label
                                    whiteSpace: 'nowrap', // Prevent label from wrapping
                                    flexShrink: 0, // Prevent label from shrinking
                                }}>
                                Email
                            </Typography>
                            {isEditingEmail ? (
                                <>
                                    <TextField
                                        id="email"
                                        style={{
                                            flex: 1,
                                            marginRight: '10px',
                                            // borderColor: isEditingEmail ? colors.primary[400] : colors.grey[100],
                                        }}
                                        value={email}
                                        InputProps={{
                                            readOnly: !isEditingEmail, // Make it read-only when not editing
                                            classes: {
                                                notchedOutline: 'editing-email-outline',
                                            },
                                        }}
                                        onChange={(e) => setEmail(e.target.value)}
                                        size="small"
                                        fullWidth
                                        focused
                                    />
                                    <SaveOutlinedIcon onClick={handleSaveEmail} />
                                    <style jsx>{`
                                        .editing-email-outline {
                                            border-color: ${colors.greenAccent[600]} !important;
                                            
                                        }
                                    `}</style>
                                </>
                            ) : (
                                <>
                                    <TextField
                                        id="email"
                                        style={{
                                            flex: 1,
                                            marginRight: '10px',
                                        }}
                                        value={email}
                                        InputProps={{
                                            readOnly: true,
                                            classes: {
                                                notchedOutline: 'read-email-outline',
                                            },
                                        }}
                                        size="small"
                                        fullWidth
                                    />
                                    <EditOutlinedIcon onClick={handleEditEmail} />
                                    <style jsx>{`
                                        .read-email-outline {
                                            border-color: ${colors.grey[600]} !important;
                                            
                                        }
                                    `}</style>
                                </>
                            )}
                        </Box> */}

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
                            }} onClick={() => { removeCookie("accessToken", { path: '/' }); navigate('/login') }}>
                                Log Out
                            </Button>
                        </Box>
                    </Box>
                </div>

            </main>
        </>
    );
}