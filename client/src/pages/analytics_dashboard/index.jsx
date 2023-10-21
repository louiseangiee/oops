import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const Analytics = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Analytics Overview" subtitle="this is an analytics page" />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="250px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          name="Total Portfolio Value"
        >
          TOTAL PORTFOLIO VALUE HERE
          {/* <PortfolioCard
            title="Technology Stocks"
            subtitle="All the technological stocks"
            capital="23456"
            returns="-1234"
          /> */}
        </Box>
        {/* Individual Portfolio Details */}
        <Box gridColumn="span 9" backgroundColor={colors.primary[400]} padding={"10px 20px"} sx={{ overflow: "auto" }}>
          <Header title="Your Portfolios" />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Portfolio Name</TableCell>
                  <TableCell>Average Purchase Price</TableCell>
                  <TableCell>Average Market Cost</TableCell>
                  <TableCell>Yield Cost Ratio</TableCell>
                  <TableCell>Evaluation</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Technology Stocks</TableCell>
                  <TableCell>$123.45</TableCell>
                  <TableCell>$234.56</TableCell>
                  <TableCell>1.23</TableCell>
                  <TableCell>+$123.45</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Technology Stocks</TableCell>
                  <TableCell>$123.45</TableCell>
                  <TableCell>$234.56</TableCell>
                  <TableCell>1.23</TableCell>
                  <TableCell>+$123.45</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Technology Stocks</TableCell>
                  <TableCell>$123.45</TableCell>
                  <TableCell>$234.56</TableCell>
                  <TableCell>1.23</TableCell>
                  <TableCell>+$123.45</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* ROW 2 */}






      </Box>
    </Box>
  );
};

export default Analytics;