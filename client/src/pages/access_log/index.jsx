import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockAccessLogs, mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { getAsync } from "../../utils/utils";
import { useCookies } from "react-cookie";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import Lottie from 'lottie-react';
import noData from './no_data.json';
import loading from './fetching_data.json';

const AccessLog = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [cookie] = useCookies(["accessToken"]);
  const [accessLogData, setAccessLogData] = useState(null);

  const userData = useAuth().userData;
  // const accessLogs = userData.accessLogs;
  const userId = userData.id;
  // console.log(accessLogs);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAsync("accessLogs/user/" + userId, cookie.accessToken);
      const data = await response.json();
      console.log(data?.content);
      setAccessLogData(data?.content);
    };
    fetchData();
  }, [useAuth, cookie.accessToken]);


  const columns = [
    { field: "logId", headerName: "ID" },
    { field: "action", headerName: "Action", flex: 1 },
    {
      field: "timestamp",
      headerName: "Timestamp",
      type: "dateTime",
      headerAlign: "left",
      align: "left",
      flex: 1,
      valueGetter: (params) => new Date(params.value),
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="ACCESS LOG"
        subtitle="History of Access to the System"
      />
      <Box
        m="30px 0 0 0"
        height="70vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        {!accessLogData ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Lottie
              animationData={loading}
              loop={true} // Set to true for looping
              autoplay={true} // Set to true to play the animation automatically
              style={{ width: 300, height: 300 }}
            />
          </Box>
        ) : accessLogData.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Lottie
              animationData={noData}
              loop={true} // Set to true for looping
              autoplay={true} // Set to true to play the animation automatically
              style={{ width: 300, height: 300 }}
            />
          </Box>
          ) : (
          <DataGrid
            rows={accessLogData}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row.logId}
          />
        )}

      </Box>
    </Box>
  );
};

export default AccessLog;