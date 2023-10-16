import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import EditIcon from '@mui/icons-material/Edit';
import { useCookies } from "react-cookie";
import { getAsync, putAsync } from "../utils/utils";
import { Link } from 'react-router-dom';

const PortfolioCard = ({ title, subtitle, capital, returns, stocks, portfolioId }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [cookie, removeCookie] = useCookies(["accessToken"]);
    const capitalColor = (capital >= 0 || capital == null) ? colors.greenAccent[500] : colors.redAccent[500];
    const returnsColor = (returns >= 0 || returns == null) ? colors.greenAccent[500] : colors.redAccent[500];
    capital = capital > 0 ? ("+$" + capital) : (capital == 0 || capital == null) ? "$-" : ("-$" + capital * -1);
    returns = returns > 0 ? ("+$" + returns) : (returns == 0 || returns == null) ? "$-" : ("-$" + returns * -1);

    async function fetchStockDetails(stockSymbol) {
        const response = await getAsync("stocks/"+stockSymbol, cookie.accessToken);
        if (!response.ok) {
            throw new Error(`Failed to fetch stock details for ID ${stockSymbol}`);
        }
        const stockDetails = await response.json();
        console.log(stockDetails);
        return stockDetails;
    }

    return (
        <Box width="100%" maxHeight="300px" overflowY="auto">
            <Box display="flex" justifyContent="space-between">
                <Box>
                    <Link to={`/portfolio/${portfolioId}`} sx={{textDecoration: 'none'}}>
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{ color: colors.grey[100] }}
                        >
                            {title}
                        </Typography>
                    </Link>
                </Box>
                <Box>
                    <a href="">
                        <EditIcon
                            sx={{ color: colors.greenAccent[600], fontSize: "22px" }}
                        /></a>

                </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mt="2px">
                <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
                    {subtitle}
                </Typography>
                {/* <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: colors.greenAccent[600] }}
        >
          {increase}
        </Typography> */}
            </Box>
            <br></br>
            <Box display="flex" justifyContent="space-between" mt="2px">
                <Typography
                    variant="h6"
                    fontStyle="italic"
                    sx={{ color: colors.grey[300] }}
                >
                    Capital
                </Typography>
                <Typography
                    variant="h6"
                    fontStyle="italic"
                    sx={{ color: colors.grey[300] }}
                >
                    Returns
                </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mt="2px">
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{ color: capitalColor }}
                >
                    {capital}
                </Typography>
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{ color: returnsColor }}
                >
                    {returns}
                </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mt="2px">
            </Box>
            <br></br>
            <Box display="flex" justifyContent="space-between" mt="2px">
                <Typography
                    variant="h6"
                    fontStyle="italic"
                    sx={{ color: colors.grey[300] }}
                >
                    Code
                </Typography>
                <Typography
                    variant="h6"
                    fontStyle="italic"
                    sx={{ color: colors.grey[300] }}
                >
                    Price & Quantity
                </Typography>
            </Box>
            {/* The list of stocks */}
            {Array.isArray(stocks) && stocks.map((stock, index) => (
                <Box key={index} display="flex" justifyContent="space-between" my="10px">
                    <Box display="flex" gap="10px">
                        <img src={`../../stocks_logos/apple.png`} width="50px" height="50px" sx={{ borderRadius: '50%' }} />
                        <Box display="flex" flexDirection="column" justifyContent="space-between" mt="2px">
                            <Typography variant="h4" fontWeight="bold" sx={{ color: colors.grey[100] }}>
                                {/* {fetchStockDetails(stock.stock_symbol)} */}
                            </Typography>
                            <Typography variant="h6" sx={{ color: colors.grey[100] }}>
                                {stock.name}
                            </Typography>
                        </Box>
                    </Box>
                    <Box display="flex" flexDirection="column" justifyContent="space-between" mt="2px" alignItems="flex-end">
                        <Typography variant="h4" fontWeight="bold" sx={{ color: colors.grey[100] }}>
                            ${stock.buyPrice}
                        </Typography>
                        <Typography variant="h6" sx={{ color: colors.greenAccent[600] }}>
                            Qty: {stock.quantity}
                        </Typography>
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default PortfolioCard;