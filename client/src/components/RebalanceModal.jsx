import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { tokens } from "../theme";
import { useTheme } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { getAsync, postAsync } from "../utils/utils";
import { useCookies } from "react-cookie";
import TextField from "@mui/material/TextField";
import { List, ListItem, Snackbar, Alert } from "@mui/material";
import loadingLight from "./lotties/loading_light.json"
import Lottie from 'lottie-react';

const RebalanceModal = ({ portfolioId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [cookie] = useCookies();
  const [open, setOpen] = useState(false);
  const [groupBy, setGroupBy] = useState("sector");
  const [allocationsData, setAllocationsData] = useState(null);
  const [page, setPage] = useState(1);
  const [targetPercentages, setTargetPercentages] = useState({});
  const [loading, setLoading] = useState(false);
  const [responseState, setResponseState] = useState({
    finalStocks: null,
    stockAdjustments: null,
    projectedTotalPortfolioValue: null,
    finalAllocations: null,
  });
  const [isPercentageValid, setIsPercentageValid] = useState(false);
  const [isAllInputsFilled, setIsAllInputsFilled] = useState(false);
  const [isErrorAlertOpen, setIsErrorAlertOpen] = useState(false);
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);

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


  const handleOpen = () => {
    setOpen(true);
    checkAllInputsFilled();
  };
  const handleClose = () => setOpen(false);
  const handleRebalanceSubmit = async () => {
    setLoading(true);
    const response = await getAsync(
      `portfolioStocks/${portfolioId}/stocks?groupBy=${groupBy}`,
      cookie.accessToken
    );
    const data = await response.json();
    setAllocationsData(data);
    setLoading(false);
    setPage(2);
  };
  const handleChange = (event) => {
    setGroupBy(event.target.value);
  };

  // Function to check if all inputs are filled
  const checkAllInputsFilled = (targetPercentagesParam = targetPercentages) => {
    const allFilled = Object.values(targetPercentagesParam).every((value) => value !== "" && value !== null);
    setIsAllInputsFilled(allFilled);
  };

  const handleAllocationChange = (name, value) => {
    let newValue = value === "" ? "" : Number(value);

    setTargetPercentages((prevState) => {
      const newState = {
        ...prevState,
        [name]: newValue,
      };

      // Check if all inputs are filled
      checkAllInputsFilled(newState);

      // Calculate the sum of percentages after state update
      const totalPercentage = Object.values(newState).reduce((acc, percentage) => acc + percentage, 0);
      setIsPercentageValid(totalPercentage == 100);

      return newState;
    });
  };

  const buildTargetPercentages = () => {
    return Object.keys(targetPercentages).reduce((acc, key) => {
      acc[key] = targetPercentages[key];
      return acc;
    }, {});
  };
  const submitRebalance = async () => {
    if (page === 2) {
      const targetPercentages = buildTargetPercentages();
      setLoading(true);
      try {
        const response = await postAsync(
          `portfolioStocks/${portfolioId}/rebalance?rebalanceType=${groupBy}`,
          { targetPercentages },
          cookie.accessToken
        );

        const data = await response.json();
        console.log(data);
        setResponseState({
          finalStocks: data.finalStocks,
          stockAdjustments: data.stockAdjustments,
          projectedTotalPortfolioValue: data.projectedTotalPortfolioValue,
          finalAllocations: data.finalAllocations,
        });
        setPage(3);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Network error:", error);
      }
    }
  };
  const handleConfirmRebalance = async () => {
    console.log({
      portfolioStocks: responseState.stockAdjustments,
    })
    setLoading(true);
    try {
      const response = await postAsync(
        `portfolioStocks/${portfolioId}/executeRebalance`,
        {
          portfolioStocks: responseState.stockAdjustments,
        }, cookie.accessToken
      );
      const data = await response.json();
      if (!response.ok) {
        handleOpenErrorAlert();
        handleClose();
      }
      else {
        handleOpenSuccessAlert();
        handleClose();
      }
    } catch (error) {
      handleOpenErrorAlert();
      handleClose();
      console.error("Network error:", error);
    }
    setLoading(false);
  };

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);
  const formatNumber = (num) => num.toFixed(2);

  useEffect(() => {
    if (allocationsData) {
      const newTargetPercentages = {};
      for (const [key, value] of Object.entries(allocationsData?.allocations)) {
        newTargetPercentages[key] = value?.percentage;
      }
      setTargetPercentages(newTargetPercentages);
    }
  }, [allocationsData]);

  return (
    <div>
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
          Rebalancing failed! Please try again.
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
          Rebalance is done successfully!
        </Alert>
      </Snackbar>
      <Button
        sx={{
          backgroundColor: colors.blueAccent[700],
          color: colors.grey[100],
          fontSize: "14px",
          fontWeight: "bold",
          padding: "8px 15px",
        }}
        onClick={handleOpen}
      >
        Rebalance
      </Button>
      <Dialog
        open={open}
        onClose={() => {
          handleClose();
          setPage(1);
        }}
        maxWidth="md" // You can adjust this size according to your content
        fullWidth
      >
        <DialogTitle id="rebalance-modal-title" sx={{ backgroundColor: colors.primary[400] }}>
          Rebalance Portfolio
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: colors.primary[400] }}>
          {page === 1 && (
            <div>
              <Typography
                id="rebalance-modal-title"
                variant="h6"
                component="h2"
              >
                Rebalance Portfolio
              </Typography>
              <Typography id="rebalance-modal-description" sx={{ mt: 2 }}>
                Specify the strategy for rebalancing:
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="group-by-select-label">Group By</InputLabel>
                    <Select
                      labelId="group-by-select-label"
                      id="group-by-select"
                      value={groupBy}
                      label="Group By"
                      onChange={handleChange}
                    >
                      {["sector", "industry", "exchange", "country"].map(
                        (option) => (
                          <MenuItem key={option} value={option}>
                            {capitalizeFirstLetter(option)}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <DialogActions
                    sx={{ backgroundColor: colors.primary[400], paddingRight: "0px" }}
                  >
                    <Button variant="contained" onClick={handleRebalanceSubmit} sx={{ width: "80px", height: "33px" }}>
                      {loading ?
                        <Lottie
                          animationData={loadingLight}
                          loop={true}
                          autoplay={true}
                          style={{ width: '60px', height: '60px' }}
                        />
                        :
                        <strong>Next</strong>
                      }
                    </Button>
                  </DialogActions>
                </Grid>
              </Grid>
            </div>
          )}
          {page === 2 && allocationsData && allocationsData?.allocations && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="h6" component="h2">
                Allocations
              </Typography>
              <br />
              {Object.entries(allocationsData?.allocations || {}).map(
                ([key, value]) => (
                  <Box
                    key={key}
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  >
                    <Typography sx={{ minWidth: "150px" }}>
                      {key}
                      <Typography>
                        Actual value: (${formatNumber(value.actualValue)})
                      </Typography>
                      <Typography>
                        Percentage: ({value.percentage.toFixed(2)}%)
                      </Typography>
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Change Percentage to:"
                      type="number"
                      inputProps={{ step: "0.01", min: "0", max: "100" }} // Uncomment and use inputProps
                      onBlur={(e) => {
                        handleAllocationChange(key, e.target.value);
                        handleAllocationChange(
                          key,
                          Math.max(0, Math.min(100, Number(e.target.value)))
                        )
                      }}
                    />
                  </Box>
                )
              )}
              {!isPercentageValid && (
                <Typography color="error">
                  The total percentage cannot exceed or be below 100%.
                </Typography>
              )}
              <DialogActions
                sx={{ backgroundColor: colors.primary[400], paddingRight: "0px" }}
              >
                <Button variant="contained" onClick={() => setPage(1)} sx={{ width: "80px", height: "33px" }}>
                  <b>Back</b>
                </Button>
                <Button
                  variant="contained"
                  onClick={() => submitRebalance()}
                  disabled={!isPercentageValid || !isAllInputsFilled}
                  sx={{ width: "80px", height: "33px" }}
                >
                  {loading ?
                    <Lottie
                      animationData={loadingLight}
                      loop={true}
                      autoplay={true}
                      style={{ width: '60px', height: '60px' }}
                    />
                    :
                    <strong>Next</strong>
                  }
                </Button>
              </DialogActions>
            </Box>
          )}
          {page === 3 && (
            <Box>
              <Typography
                variant="h6"
                sx={{ position: "absolute", top: "16px", right: "16px" }}
              >
                Projected Portfolio Value: $
                {responseState.projectedTotalPortfolioValue.toFixed(2)}
              </Typography>
              <Typography variant="h6" component="h2">
                Stock Adjustments To be Made
              </Typography>
              <List>
                {Object.entries(responseState?.stockAdjustments || {}).map(
                  ([key, value]) => (
                    <Typography key={key}>
                      {key}:
                      <span
                        style={{
                          color: value < 0 ? "red" : "green",
                        }}
                      >
                        {value > 0 ? "+" : ""}
                        {value.toFixed(2)}
                      </span>
                    </Typography>
                  )
                )}
              </List>
              <Typography variant="h6" component="h2">
                Final Stocks
              </Typography>
              <List>
                {Object.entries(responseState.finalStocks || {}).map(
                  ([key, value]) => (
                    <ListItem key={key}>
                      {key}: {value}
                    </ListItem>
                  )
                )}
              </List>
              <Typography variant="h6" component="h2">
                Final Allocations
              </Typography>
              <List>
                {Object.entries(responseState.finalAllocations || {}).map(
                  ([key, value]) => (
                    <ListItem key={key}>
                      {key}: {value.percentage.toFixed(2)}% ($
                      {value.actualValue.toFixed(2)})
                    </ListItem>
                  )
                )}
              </List>
              <DialogActions
                sx={{ backgroundColor: colors.primary[400], paddingRight: "0px" }}
              >
                <Button variant="contained" onClick={() => setPage(2)}>
                  <b>Back</b>
                </Button>
                <Button
                  variant="contained"
                  onClick={handleConfirmRebalance}
                  sx={{ width: "80px", height: "33px" }}
                >
                  {loading ?
                    <Lottie
                      animationData={loadingLight}
                      loop={true}
                      autoplay={true}
                      style={{ width: '60px', height: '60px' }}
                    />
                    :
                    <strong>Confirm</strong>
                  }
                </Button>
              </DialogActions>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RebalanceModal;
