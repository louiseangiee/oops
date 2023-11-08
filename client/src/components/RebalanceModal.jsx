import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
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
import { List, ListItem } from "@mui/material";

const RebalanceModal = ({ portfolioId }) => {
  const [open, setOpen] = useState(false);
  const [groupBy, setGroupBy] = useState("sector");
  const [allocationsData, setAllocationsData] = useState(null);
  const [page, setPage] = useState(1);
  const [targetPercentages, setTargetPercentages] = useState({});
  const [loading, setLoading] = useState(false);
  const [allocationsChanged, setAllocationsChanged] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [responseState, setResponseState] = useState({
    finalStocks: null,
    stockAdjustments: null,
    projectedTotalPortfolioValue: null,
    finalAllocations: null,
  });
  const [rebalanceSuccess, setRebalanceSuccess] = useState(false);

  const handleOpen = () => setOpen(true);
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
  const validateTotalPercentage = () => {
    const total = Object.values(allocationsData.allocations).reduce(
      (acc, { percentage }) => acc + percentage,
      0
    );
    return total == 100;
  };
  const handleAllocationChange = (name, value) => {
    setAllocationsChanged(true);
    const newValue = value === "" ? "" : Number(value);
    setAllocationsData((prevData) => ({
      ...prevData,
      allocations: {
        ...prevData.allocations,
        [name]: {
          ...prevData.allocations[name],
          percentage: newValue,
        },
      },
    }));
  };

  const buildTargetPercentages = () => {
    return Object.keys(allocationsData?.allocations).reduce((acc, key) => {
      acc[key] = allocationsData?.allocations[key]?.percentage;
      return acc;
    }, {});
  };
  const submitRebalance = async () => {
    if (page === 2 && allocationsChanged) {
      const targetPercentages = buildTargetPercentages();
      setLoading(true);
      try {
        const response = await postAsync(
          `portfolioStocks/${portfolioId}/rebalance?rebalanceType=${groupBy}`,
          { targetPercentages },
          cookie.accessToken
        );

        const data = await response.json();
        setResponseState({
          finalStocks: data.finalStocks,
          stockAdjustments: data.stockAdjustments,
          projectedTotalPortfolioValue: data.projectedTotalPortfolioValue,
          finalAllocations: data.finalAllocations,
        });
        setPage(3);
      } catch (error) {
        setLoading(false);
        console.error("Network error:", error);
      }
    }
  };
  const handleConfirmRebalance = async () => {
    console.log( {
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
      setRebalanceSuccess(true);
      setSuccessMessage(data.message);
      setPage(4);
    } catch (error) {
      console.error("Network error:", error);
    }
    setLoading(false);
  };

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);
  const formatNumber = (num) => num.toFixed(2);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [cookie] = useCookies();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "70vw",
    height: "70vh",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    overflowY: "auto",
  };

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
      <Button
        sx={{
          backgroundColor: colors.blueAccent[700],
          color: colors.grey[100],
          fontSize: "14px",
          fontWeight: "bold",
          padding: "10px 20px",
        }}
        onClick={handleOpen}
      >
        Rebalance Stocks
      </Button>
      <Modal
        open={open}
        aria-labelledby="rebalance-modal-title"
        aria-describedby="rebalance-modal-description"
        onClose={() => {
          handleClose();
          setPage(1);
        }}
      >
        <Box sx={style}>
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
                  <Button variant="contained" onClick={handleRebalanceSubmit}>
                    Submit
                  </Button>
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
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Percentage"
                      type="number"
                      inputProps={{ step: "0.01" }}
                      value={value.percentage.toFixed(2)}
                      onChange={(e) =>
                        handleAllocationChange(key, e.target.value)
                      }
                      onBlur={(e) =>
                        handleAllocationChange(
                          key,
                          Math.max(0, Math.min(100, Number(e.target.value)))
                        )
                      }
                    />
                  </Box>
                )
              )}
              {!validateTotalPercentage() && (
                <Typography color="error">
                  The total percentage cannot exceed or be below 100%.
                </Typography>
              )}
              <div>
                <Button variant="contained" onClick={() => setPage(1)}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={() => submitRebalance()}
                  disabled={!validateTotalPercentage() && allocationsChanged}
                >
                  Submit
                </Button>
              </div>
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
              <Button
                variant="contained"
                sx={{ position: "absolute", bottom: 20, right: 20 }}
                onClick={handleConfirmRebalance}
              >
                Confirm
              </Button>
            </Box>
          )}
          {page === 4 && rebalanceSuccess && (
           <Box
           sx={{
             display: 'flex',
             justifyContent: 'center',
             alignItems: 'center',
             height: '100%',
           }}
         >
           <Typography variant="h5" sx={{ color: "green", mb: 2, textAlign: 'center' }}>
             {successMessage}
           </Typography>
         </Box>
         
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default RebalanceModal;
