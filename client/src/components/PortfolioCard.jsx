import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { Link } from 'react-router-dom';
import EditPortfolio from "./EditPortfolio";

const PortfolioCard = ({ title, subtitle, capital, returns, stocks, portfolioId }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const capitalColor = (capital >= 0 || capital == null) ? colors.greenAccent[500] : colors.redAccent[500];
    const returnsColor = (returns >= 0 || returns == null) ? colors.greenAccent[500] : colors.redAccent[500];
    capital = capital > 0 ? ("+$" + capital) : (capital === 0 || capital == null) ? "$-" : ("-$" + capital * -1);
    returns = returns > 0 ? ("+$" + returns) : (returns === 0 || returns == null) ? "$-" : ("-$" + returns * -1);

    return (
        <Box width="100%" display="flex" flexDirection="column" justifyContent='flex-start' maxHeight="300px"
        // sx={{
        //     overflow: "hidden",
        //     overflowY: "auto",
        //     '&::-webkit-scrollbar': {
        //         display: 'none',
        //     },
        //     // Hide scrollbar for IE, Edge, and Firefox
        //     msOverflowStyle: 'none',  // IE and Edge
        //     scrollbarWidth: 'none',  // Firefox
        // }}
        >
            <Box display="flex" justifyContent="space-between">
                <Box>
                    <Link to={`/portfolio/${portfolioId}`} sx={{ textDecoration: 'none' }}>
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

                    <EditPortfolio portfolioId={portfolioId} small />
                </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mt="2px">
                <Typography variant="h6" sx={{ color: colors.greenAccent[500] }}>
                    {subtitle}
                </Typography>
            </Box>
            <br></br>
            <Box display="flex" justifyContent="space-between" mt="2px">
                <Typography
                    variant="h6"
                    fontStyle="italic"
                    sx={{ color: colors.grey[300], fontSize: "10px" }}
                >
                    Capital
                </Typography>
                {/* <Typography
                    variant="h6"
                    fontStyle="italic"
                    sx={{ color: colors.grey[300], fontSize: "10px" }}
                >
                    Returns
                </Typography> */}
            </Box>
            <Box display="flex" justifyContent="space-between" mt="2px">
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{ color: capitalColor }}
                >
                    {capital}
                </Typography>
                {/* <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{ color: returnsColor }}
                >
                    {returns}
                </Typography> */}
            </Box>
            <Box display="flex" justifyContent="space-between" mt="2px">
            </Box>
            <br></br>
            <Box display="flex" justifyContent="space-between" mt="2px">
                <Typography
                    variant="h6"
                    fontStyle="italic"
                    sx={{ color: colors.grey[300], fontSize: "10px" }}
                >
                    Code
                </Typography>
                <Typography
                    variant="h6"
                    fontStyle="italic"
                    sx={{ color: colors.grey[300], fontSize: "10px" }}
                >
                    Buy Price & Quantity
                </Typography>
            </Box>
            {/* The list of stocks */}
            {Array.isArray(stocks) && stocks.length > 0 ? (
                <Box
                    sx={{
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': { display: 'none' },
                        msOverflowStyle: 'none',  // IE and Edge
                        scrollbarWidth: 'none',  // Firefox
                    }}
                >
                    {/* Mapping over stocks */}
                    {stocks.map((stock, index) => (
                        <Box key={index} display="flex" justifyContent="space-between" my="10px" >
                            <Box display="flex" gap="10px">
                                <Box display="flex" flexDirection="column" justifyContent="space-between" mt="2px">
                                    <Typography variant="h4" fontWeight="bold" sx={{ color: colors.grey[100] }}>
                                        {stock.stockSymbol}
                                    </Typography>
                                    <Typography variant="p"
                                        sx={{
                                            fontSize: '10px',
                                            color: colors.grey[100],
                                            maxWidth: '100px',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                        }}>
                                        {stock.stockIndustry}
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
                    ))
                    }
                </Box>
            ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="150px">
                    <Typography variant="subtitle1" sx={{ color: colors.grey[300] }}>
                        No stocks yet
                    </Typography>
                </Box>
            )}

        </Box >
    );
};

export default PortfolioCard;