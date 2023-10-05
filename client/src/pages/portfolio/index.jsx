import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import Header from "../../components/Header";
import PortfolioCard from "../../components/PortfolioCard";
import { useLocation } from "react-router-dom";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import EditPortfolio from "../../components/EditPortfolio";
import StatBox from "../../components/StatBox";
import StocksTabs from "../../components/StocksTabs";

const Portfolio = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const location = useLocation();
  const formData = location.state ? location.state.formData : null;
  if (!formData) {
    // Handle the case where formData is not available, e.g., show an error message.
    return <div>ERROR: No formData available</div>;
  }
  console.log(formData);

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/" sx={{ fontSize: "22px" }}>
      <h1>PORTFOLIOS</h1>
    </Link>,
    <Typography key="2" color="text.primary" sx={{ fontSize: "22px" }}>
      <h1>{formData['portfolioName']}</h1>
    </Typography>,
  ];

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <Breadcrumbs separator="/" aria-label="breadcrumb" sx={{ height: "75px" }}>
            {breadcrumbs}
          </Breadcrumbs>
          <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb="20px">
            {formData['portfolioDescription']}
          </Typography>
        </Box>

        {/* <Header title={"Portfolio > "+formData['portfolioName']} subtitle={formData['portfolioDescription']} /> */}

        <Box>
          <EditPortfolio />
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="100px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 6"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="flex-start"
          justifyContent="center"
          flexDirection="column"
          gap="5px"
          pl="20px"
          borderRadius="10px"
        >
          <Typography
            variant="h6"
            fontStyle="italic"
            sx={{ color: colors.grey[300] }}
          >
            Capital
          </Typography>
          <Typography
            variant="h1"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            ${formData['portfolioCapital']}
          </Typography>

        </Box>
        <Box
          gridColumn="span 6"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="flex-start"
          justifyContent="center"
          flexDirection="column"
          gap="5px"
          pl="20px"
          borderRadius="10px"
        >
          <Typography
            variant="h6"
            fontStyle="italic"
            sx={{ color: colors.grey[300] }}
          >
            Return
          </Typography>
          <Typography
            variant="h1"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            $-
          </Typography>

        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 12"
          // gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <StocksTabs />
        </Box>
        {/* 
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Revenue Generated
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                $59,342.32
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          {mockTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.date}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${transaction.cost}
              </Box>
            </Box>
          ))}
        </Box> */}

        {/* ROW 3 */}
        {/* <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box> */}
      </Box>
    </Box>
  );
};

export default Portfolio;