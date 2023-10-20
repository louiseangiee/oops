import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import EqualizerIcon from '@mui/icons-material/Equalizer';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import RestoreIcon from '@mui/icons-material/Restore';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                {/* <Typography variant="h3" color={colors.grey[100]}>
                  ADMINIS
                </Typography> */}
                <img
                  alt="goldman-logo"
                  width="80px"
                  height="35px"
                  src={theme.palette.mode === 'dark' ? `../../Goldman_Sachs_Logos/logos_for_screen/GS_logo_PNG/Goldman_Sachs_Signature_Reverse.png` : `../../Goldman_Sachs_Logos/logos_for_screen/GS_logo_PNG/Goldman_Sachs_Signature.png`}
                  style={{ cursor: "pointer" }}
                />
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          <Box paddingLeft={isCollapsed ? undefined : "15%"}>
            <Item
              title="Home"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography> */}
            <Item
              title="Analytics"
              to="/analytics"
              icon={<EqualizerIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Access Log"
              to="/access_log"
              icon={<RestoreIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <Typography variant="h6" color={colors.grey[300]} sx={{ m: "15px 0 5px 20px" }}>
              Template (For Reference)
            </Typography>
            <Item
              title="Contacts"
              to="/contacts"
              icon={<RestoreIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Invoices"
              to="/invoices"
              icon={<RestoreIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Team"
              to="/team"
              icon={<RestoreIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            {/* <Item
              title="FAQ Page"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}

            />  */}

          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;