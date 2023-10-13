import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import PortfolioCard from "../../components/PortfolioCard";
import ProgressCircle from "../../components/ProgressCircle";
import CreatePortfolio from "../../components/CreatePortfolioForm";

const Analytics = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="PORTFOLIOS" subtitle="Welcome to your portfolios page" />

        <Box>
          <CreatePortfolio />
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="450px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <PortfolioCard
            title="Technology Stocks"
            subtitle="All the technological stocks"
            capital="23456"
            returns="-1234"
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <PortfolioCard
            title="Technology Stocks"
            subtitle="All the technological stocks"
            progress="0.75"
            increase="+14%"
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <PortfolioCard
            title="Technology Stocks"
            subtitle="All the technological stocks"
            progress="0.75"
            increase="+14%"
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <PortfolioCard
            title="Technology Stocks"
            subtitle="All the technological stocks"
            progress="0.75"
            increase="+14%"
          />
        </Box>

        
      </Box>
    </Box>
  );
};

export default Analytics;