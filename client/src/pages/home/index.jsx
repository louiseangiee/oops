import { Box, IconButton, Typography, useTheme, InputBase } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import PortfolioCard from "../../components/PortfolioCard";
import CreatePortfolio from "../../components/CreatePortfolioForm";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import Lottie from 'lottie-react';
import loading from './fetching_data.json';
import noData from './no_data.json';
import { useAuth } from "../../context/AuthContext";
import { getAsync } from "../../utils/utils";
import SearchIcon from '@mui/icons-material/Search';

const Home = () => {
  const theme = useTheme();
  // const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);
  const [dataFetched, setDataFetched] = useState(null);
  const [cookie] = useCookies();

  const { userData } = useAuth();
  const role = userData.role;
  const [searchQuery, setSearchQuery] = useState(""); // State variable to store the search query
  const [filteredData, setFilteredData] = useState([]); // State variable for filtered results

  useEffect(() => {
    const fetchData = async () => {
      if (!userData.id) return;

      let portfolios = [];

      if (role === "ROLE_ADMIN") {
        const response = await getAsync('portfolios', cookie.accessToken);
        portfolios = await response.json();
      } else if (role === "ROLE_USER") {
        const response = await getAsync('portfolios/user/' + userData.id, cookie.accessToken);
        portfolios = await response.json();
      }

      setDataFetched(portfolios);

      // // Fetch and add the overall returns for each portfolio
      // const portfoliosWithReturns = await Promise.all(portfolios.map(async (portfolio) => {
      //   try {
      //     const summaryResponse = await getAsync(`portfolioStocks/${portfolio.portfolioId}/summary`, cookie.accessToken);
      //     if (!summaryResponse.ok) {
      //       // If the response is not OK, throw an error
      //       throw new Error(`HTTP error! status: ${summaryResponse.status}`);
      //     }
      //     const summaryData = await summaryResponse.json();
      //     const overallReturn = summaryData.overallReturns.overalReturn;
      //     return { ...portfolio, overallReturn: overallReturn };
      //   } catch (error) {
      //     console.error('Failed to fetch overall returns for portfolio:', portfolio.portfolioId, error);
      //     return { ...portfolio, overallReturn: null }; // Handle the error case
      //   }
      // }));

      // setDataFetched(portfoliosWithReturns);
    };

    fetchData();
  }, [userData.id, role, cookie.accessToken]);

  useEffect(() => {
    const filteredResults = dataFetched?.filter((portfolio) =>
      portfolio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      portfolio.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filteredResults);
  }, [searchQuery, dataFetched]);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="PORTFOLIOS" subtitle={role === "ROLE_ADMIN" ? "Welcome Admin!" : "Welcome to your portfolios page!"} />

        <Box>
          <CreatePortfolio />
        </Box>
      </Box>

      {/* SEARCH BAR */}
      <Box display="flex" marginBottom="20px">
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
          width="100%"
        >
          <InputBase
            sx={{ ml: 2, flex: 1 }}
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>


      {/* GRID & CHARTS */}
      {!filteredData ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Lottie
            animationData={loading}
            loop={true} // Set to true for looping
            autoplay={true} // Set to true to play the animation automatically
            style={{ width: 300, height: 300 }}
          />
        </Box>

      ) : filteredData.length === 0 ? (

        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">

          <Lottie
            animationData={noData}
            loop={true} // Set to true for looping
            autoplay={true} // Set to true to play the animation automatically
            style={{ width: 300, height: 300 }}
          />
          <Typography variant="h4" fontWeight="600" color={colors.grey[100]} mb="20px">
            No portfolios found
          </Typography>
        </Box>

      ) : (
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="auto"
          gap="20px"
        >
          {/* ROW 1 */}
          {Array.isArray(filteredData) &&
            filteredData.map((portfolio, index) => (
              <Box
                gridColumn="span 3"
                backgroundColor={colors.primary[400]}
                display="flex"
                alignItems="flex-start"
                justifyContent="center"
                key={index}
                padding="20px"
                borderRadius="3px"
              >
                <PortfolioCard
                  title={portfolio.name}
                  subtitle={portfolio.description}
                  capital={portfolio.totalCapital}
                  returns={portfolio.overallReturn}
                  stocks={portfolio.portfolioStocks}
                  portfolioId={portfolio.portfolioId}
                />
              </Box>
            ))}
        </Box>
      )
      }
    </Box>
  );
};

export default Home;