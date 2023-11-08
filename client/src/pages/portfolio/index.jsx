import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Box, Button, Typography, useTheme, Link, Snackbar, Alert } from "@mui/material";
import { tokens } from "../../theme";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import EditPortfolio from "../../components/EditPortfolio";
import StocksTabs from "../../components/StocksTabs";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCookies } from "react-cookie";
import { deleteAsync, getAsync } from "../../utils/utils";
import { useAuth } from "../../context/AuthContext";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import noDataAnimation from './no_data.json';
import Loading from './fetching_data.json';
import loadingLight from "./loading_light.json";
import RebalanceModal from "../../components/RebalanceModal";


function DeletePortfolio() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [isErrorAlertOpen, setIsErrorAlertOpen] = useState(false);
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);
  const navigate = useNavigate();

  const { portfolioId } = useParams();
  const [portfolioData, setPortfolioData] = useState({}); // [portfolioData, setPortfolioData
  const [cookie] = useCookies();
  const [loading, setLoading] = useState(false); // Add a loading state

  // Fetch the portfolio data based on portfolioId
  useEffect(() => {
    async function fetchData() {
      const response = await getAsync('portfolios/' + portfolioId, cookie.accessToken);
      const data = await response.json();
      setPortfolioData(data);
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
      // when deleted, navigate to home page
      setLoading(false);
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
          Portfolio deletion failed!
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
        }}>
          Confirm Deletion of Portfolio
        </DialogTitle>
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
                loop={true}
                autoplay={true}
                style={{ width: '80px', height: '80px' }}
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
  const [cookie] = useCookies();

  const { userData } = useAuth();
  const { portfolioId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  // State to store portfolio data
  const [portfolioData, setPortfolioData] = useState({});
  const [overallReturns, setOverallReturns] = useState(0);
  const [percentageReturns, setPercentageReturns] = useState(0);
  const [refreshIntervalId, setRefreshIntervalId] = useState(null);

  // Fetch portfolio data
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
      }
    }
  };


  // Fetch Portfolio Returns
  const fetchPortfolioSummaryData = async () => {
    const portfolioSummaryResponse = await getAsync(`portfolioStocks/${portfolioId}/summary`, cookie.accessToken);
    const portfolioSummaryData = await portfolioSummaryResponse.json();
    console.log(portfolioSummaryData.overallReturns.percentage)
    setOverallReturns(portfolioSummaryData.overallReturns.overalReturn);
    setPercentageReturns(portfolioSummaryData.overallReturns.percentage);
    // TODO - set Loading State for portfolio summary
  }

  // Fetch data on initial component load
  useEffect(() => {
    const fetchData = async () => {
      await fetchPortfolioData();
      await fetchPortfolioSummaryData();
    }

    fetchData()
    // Set up an interval to periodically fetch data (e.g., every 30 seconds)
    const intervalId = setInterval(fetchData, 30000); // Adjust the interval as needed
    setRefreshIntervalId(intervalId);

    return () => {
      if (refreshIntervalId) {
        clearInterval(refreshIntervalId);
      }
    };
  }, [portfolioId, userData, overallReturns, percentageReturns]);

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/" sx={{ fontSize: "22px" }}>
      <h1>PORTFOLIOS</h1>
    </Link>,
    <Typography key="2" color="text.primary" sx={{ fontSize: "22px" }}>
      <h1>{portfolioData && portfolioData['name'] ? portfolioData['name'] : "Loading..."}</h1>
    </Typography>,
  ];

  //no data or no access
  if (!portfolioData) {
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
          loop={true}
          autoplay={true}
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

        <Box display="flex" gap="5px">
          <EditPortfolio portfolioId={portfolioId} />
          <DeletePortfolio />
          <RebalanceModal portfolioId={portfolioId} />
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
          gridColumn="span 4"
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
            Initial Capital
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
          gridColumn="span 4"
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
            sx={{ color: overallReturns > 0 ? 'green' : overallReturns < 0 ? 'red' : colors.grey[100] }}
          >
            {overallReturns !== undefined && percentageReturns !== undefined ? (
              `${overallReturns < 0 ? '-' : overallReturns > 0 ? '+' : ''}${Math.abs(overallReturns)}/${percentageReturns}%`
            ) : (
              "Loading..."
            )}
          </Typography>


        </Box>
        <Box
          gridColumn="span 4"
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
            Remaining Capital
          </Typography>
          <Typography
            variant="h1"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            ${portfolioData && portfolioData['remainingCapital'] ? portfolioData['remainingCapital'] : '-'}
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
            portfolioId={portfolioId}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Portfolio;