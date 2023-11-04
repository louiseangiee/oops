import { } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Box, Button, Typography, useTheme, Link, Snackbar, Alert } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import Header from "../../components/Header";
import PortfolioCard from "../../components/PortfolioCard";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import EditPortfolio from "../../components/EditPortfolio";
import StatBox from "../../components/StatBox";
import StocksTabs from "../../components/StocksTabs";
import { useParams, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useCookies } from "react-cookie";
import { deleteAsync, getAsync, putAsync } from "../../utils/utils";
import { useAuth } from "../../context/AuthContext";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import noDataAnimation from './no_data.json';
import Loading from './fetching_data.json';
import loadingLight from "./loading_light.json";


function DeletePortfolio() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = React.useState(false);
  const [isErrorAlertOpen, setIsErrorAlertOpen] = useState(false);
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);
  const navigate = useNavigate();


  // Access the portfolio_id parameter from the URL
  const { portfolioId } = useParams();
  const [portfolioData, setPortfolioData] = useState({}); // [portfolioData, setPortfolioData
  const [cookie, removeCookie] = useCookies(["accessToken"]);
  const [loading, setLoading] = useState(false); // Add a loading state

  // Fetch the portfolio data based on portfolioId
  useEffect(() => {
    // Replace this with your actual data fetching logic
    // Example: fetch portfolio data using portfolioId
    async function fetchData() {
      const response = await getAsync('portfolios/' + portfolioId, cookie.accessToken);
      const data = await response.json();
      setPortfolioData(data);
      console.log(data);
    }
    fetchData();
  }, [portfolioId, cookie.accessToken]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // error alert handler
  const handleOpenErrorAlert = () => {
    setIsErrorAlertOpen(true);
    setIsSuccessAlertOpen(false);
  };
  const handleCloseErrorAlert = () => {
    setIsErrorAlertOpen(false);
  };

  // success alert handler
  const handleOpenSuccessAlert = () => {
    setIsSuccessAlertOpen(true);
    setIsErrorAlertOpen(false);

  };
  const handleCloseSuccessAlert = () => {
    setIsSuccessAlertOpen(false);
  };

  const handleDelete = async () => {
    if (document.getElementById('confirm-deletion').value !== portfolioData['name']) {
      handleOpenErrorAlert();
      setOpen(false);
      return;
    }
    setLoading(true);
    const response = await deleteAsync('portfolios/' + portfolioData['portfolioId'], cookie.accessToken);
    if (response.ok) {
      // Handle the case when the response is not OK, for example, show an error message.
      setLoading(false);
      console.log("Deleted portfolio with ID " + portfolioData['portfolioId']);
      setOpen(false);
      navigate("/");
      handleOpenSuccessAlert();
    } else {
      setLoading(false);
      handleOpenErrorAlert();
      setOpen(false);
      return;
    }

  }

  return (
    <div>
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
          Portfolio deletion failed!
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
          variant="filled"
          severity="success"
          onClose={handleCloseSuccessAlert}
          sx={{ backgroundColor: colors.greenAccent[600] }}
        >
          Portfolio deletion is successful!
        </Alert>
      </Snackbar>

      <DeleteOutlineOutlinedIcon sx={{ color: colors.redAccent[600], fontSize: "35px" }} onClick={handleClickOpen} />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{
          color: colors.greenAccent[600],
          backgroundColor: colors.primary[400],
          fontSize: "22px",
          fontWeight: "bold"
        }}>Confirm Deletion of Portfolio</DialogTitle>
        <DialogContent sx={{ backgroundColor: colors.primary[400] }}>
          <DialogContentText>
            Please confirm that you would like to delete this portfolio by entering the name of the portfolio down below. Do note that this action cannot be undone.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="confirm-deletion"
            label="Confirm Portfolio Name"
            type="email"
            fullWidth
            variant="standard"
            sx={{ color: colors.grey[100] }}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.primary[400], paddingBottom: "30px", paddingRight: "20px" }}>
          <Button
            onClick={handleClose}
            sx={{
              color: colors.grey[300],
              fontWeight: "bold"
            }}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            sx={{
              backgroundColor: loading ? colors.redAccent[700] : colors.redAccent[600],
              color: colors.grey[100],
              fontWeight: "bold",
              height: "40px",
              width: "80px",
              ":hover": {
                backgroundColor: colors.redAccent[700]
              }
            }}>
            {loading ?
              <Lottie
                animationData={loadingLight}
                loop={true} // Set to true for looping
                autoplay={true} // Set to true to play the animation automatically
                style={{ width: '80px', height: '80px' }} // Customize the dimensions
              />
              :
              "Delete"
            }
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const Portfolio = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [cookie, removeCookie] = useCookies(["accessToken"]);

  const { userData } = useAuth();

  // Access the portfolio_id parameter from the URL
  const { portfolioId } = useParams();
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  // State to store portfolio data
  const [portfolioData, setPortfolioData] = useState({});
  const [refreshIntervalId, setRefreshIntervalId] = useState(null); // Store the interval ID

  // Function to fetch portfolio data
  const fetchPortfolioData = async () => {
    if (userData && portfolioId) {
      if (userData.role === "ROLE_ADMIN") {
        const response = await getAsync(`portfolios/${portfolioId}`, cookie.accessToken);
        if (!response.ok) {
          // Handle the case when the response is not OK, for example, show an error message.
          setPortfolioData(null);
          setIsLoading(false);
          return;
        }
        const data = await response.json();
        setPortfolioData(data);
        setIsLoading(false); // Data is loaded, set isLoading to false
        console.log(data);
      } else if (userData.role === "ROLE_USER") {
        const response = await getAsync(`portfolios/${userData.id}/${portfolioId}`, cookie.accessToken);
        if (!response.ok) {
          // Handle the case when the response is not OK, for example, show an error message.
          setPortfolioData(null);
          setIsLoading(false);
          return;
        }
        const data = await response.json();
        setPortfolioData(data);
        setIsLoading(false); // Data is loaded, set isLoading to false
        console.log(data);
      }
    }
  };

  // Fetch data on initial component load
  useEffect(() => {
    fetchPortfolioData();
    console.log("Cleared interval " + refreshIntervalId);
    // Set up an interval to periodically fetch data (e.g., every 30 seconds)
    const intervalId = setInterval(fetchPortfolioData, 30000); // Adjust the interval as needed
    setRefreshIntervalId(intervalId);

    // Clear the interval when the component unmounts
    return () => {
      if (refreshIntervalId) {
        clearInterval(refreshIntervalId);

      }
    };
  }, [portfolioId, cookie.accessToken]);

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/" sx={{ fontSize: "22px" }}>
      <h1>PORTFOLIOS</h1>
    </Link>,
    <Typography key="2" color="text.primary" sx={{ fontSize: "22px" }}>
      <h1>{portfolioData && portfolioData['name'] ? portfolioData['name'] : "Loading..."}</h1>
    </Typography>,
  ];

  if (!portfolioData) {
    // If portfolioData doesn't exist or doesn't have a name, show the Lottie animation
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="80%">

        <Lottie
          animationData={noDataAnimation}
          loop={true} // Set to true for looping
          autoplay={true} // Set to true to play the animation automatically
          style={{ width: 300, height: 300 }}
        />
        <Typography variant="h4" fontWeight="600" color={colors.grey[100]} mb="20px" textAlign={"center"}>
          Sorry, we couldn't find the portfolio you're looking for! <br />Either this portfolio doesn't exist or you don't have access to it.
        </Typography>
      </Box>
    );
  }
  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="80%">
        <Lottie
          animationData={Loading}
          loop={true} // Set to true for looping
          autoplay={true} // Set to true to play the animation automatically
          style={{ width: 300, height: 300 }}
        />
      </Box>
    );
  }

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <Breadcrumbs separator="/" aria-label="breadcrumb" sx={{ height: "75px" }}>
            {breadcrumbs}
          </Breadcrumbs>
          <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb="20px">
            {portfolioData && portfolioData['description'] ? portfolioData['description'] : 'Loading...'}
          </Typography>
        </Box>

        {/* <Header title={"Portfolio > "+formData['portfolioName']} subtitle={formData['portfolioDescription']} /> */}

        <Box display="flex" gap="5px">
          <EditPortfolio portfolioId={portfolioId} />
          <DeletePortfolio />
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
            ${portfolioData && portfolioData['totalCapital'] ? portfolioData['totalCapital'] : '-'}
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
          <StocksTabs 
            stocks={portfolioData['portfolioStocks'] ? portfolioData['portfolioStocks'] : null} 
            portfolio_id={portfolioId}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Portfolio;