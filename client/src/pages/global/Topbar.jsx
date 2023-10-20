import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchIcon from '@mui/icons-material/Search';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Link } from 'react-router-dom';

const Topbar = ({ visible }) => {
    // grabs the theme, allow you to have access to the theme
    const theme = useTheme();
    // anytime we want to use the color mode from MUI, we can grab it from useTheme and pass it to tokens
    const colors = tokens(theme.palette.mode);
    // to toggle the different states of the color mode
    const colorMode = useContext(ColorModeContext);

    return (
        <Box display="flex" justifyContent="space-between" p={2}> {/* Box component is like a div component but it's convenient because you can put CSS properties into the Box component directly */}
            {/* SEARCH BAR */}
            {visible ? (
                <Box display="flex">
                    <Box
                        display="flex"
                        backgroundColor={colors.primary[400]}
                        borderRadius="3px"
                        visibility={visible ? "visible" : "hidden"}
                    >
                        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
                        <IconButton type="button" sx={{ p: 1 }}>
                            <SearchIcon />
                        </IconButton>
                    </Box>
                </Box>
            ) : (
                <Box display="flex">
                    <Link to="/">
                        <IconButton >
                            <HomeOutlinedIcon visibility={visible ? "hidden" : "visible"} />
                        </IconButton>
                    </Link>
                    <Box
                        display="flex"
                        backgroundColor={colors.primary[400]}
                        borderRadius="3px"
                        visibility={visible ? "visible" : "hidden"}
                    >
                        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
                        <IconButton type="button" sx={{ p: 1 }}>
                            <SearchIcon />
                        </IconButton>
                    </Box>
                </Box>
            )}


            {/* ICONS SECTION */}
            <Box display="flex">
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === 'dark' ? (
                        <DarkModeOutlinedIcon />
                    ) : (
                        <LightModeOutlinedIcon />
                    )}
                </IconButton>
                <IconButton>
                    <NotificationsOutlinedIcon />
                </IconButton>
                {/* <IconButton>
                    <SettingsOutlinedIcon />
                </IconButton> */}
                <Link to="/profile">
                    <IconButton>
                        <PersonOutlinedIcon />
                    </IconButton>
                </Link>

            </Box>
        </Box>);
}

export default Topbar;