import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockAccessLogs, mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";

const AccessLog = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "userId", headerName: "User ID" },
    // {
    //   field: "name",
    //   headerName: "Name",
    //   flex: 1,
    //   cellClassName: "name-column--cell",
    // },
    {
      field: "time",
      headerName: "Time",
      type: "dateTime",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "HTTPMethod",
      headerName: "HTTP Method",
      flex: 1,
    },
    {
      field: "endpoint",
      headerName: "Request Endpoint",
      flex: 1,
    },
    {
      field: "responseCode",
      headerName: "Response Code",
      flex: 1,
    },
    {
      field: "auth",
      headerName: "Authentication Status",
      flex: 1,
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
        <DataGrid
          rows={mockAccessLogs}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default AccessLog;