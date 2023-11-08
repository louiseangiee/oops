import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
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
  const [cookie] = useCookies();
  const [accessLogData, setAccessLogData] = useState(null);

  const { userData } = useAuth();
  const userId = userData.id;

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      if (userData.role === "ROLE_ADMIN") {
        const response = await getAsync("accessLogs", cookie.accessToken);
        if (response.ok) {
          const data = await response.json();
          setAccessLogData(data);
        } else {
          setAccessLogData(null);
        }
      } else if (userData.role === "ROLE_USER") {
        const response = await getAsync("accessLogs/user/" + userId, cookie.accessToken);
        if (response.ok) {
          const data = await response.json();
          setAccessLogData(data);
        } else {
          setAccessLogData(null);
        }
      }
    };
    fetchData();
  }, [useAuth, cookie.accessToken]);


  const columns = [
    { field: "logId", headerName: "ID" }, {
      field: "timestamp",
      headerName: "Timestamp",
      type: "dateTime",
      headerAlign: "left",
      align: "left",
      flex: 0.3,
      valueGetter: (params) => new Date(params.value),
    },
    {
      field: "action", headerName: "Action", flex: 1, renderCell: (params) => (
        <Box
          sx={{
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%', // You can set a specific width if needed
          }}
        >
          {params.value}
        </Box>)
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
              loop={true}
              autoplay={true}
              style={{ width: 300, height: 300 }}
            />
          </Box>
        ) : accessLogData.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Lottie
              animationData={noData}
              loop={true}
              autoplay={true}
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