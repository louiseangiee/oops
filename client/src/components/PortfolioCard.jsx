import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import EditIcon from '@mui/icons-material/Edit';

const PortfolioCard = ({ title, subtitle, capital, returns }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const capitalColor = (capital >= 0 || capital == null) ? colors.greenAccent[500] : colors.redAccent[500];
    const returnsColor = (returns >= 0 || returns == null) ? colors.greenAccent[500] : colors.redAccent[500];
    capital = capital > 0 ? ("+$" + capital) : (capital == 0 || capital == null) ? "$-" : ("-$" + capital * -1);
    returns = returns > 0 ? ("+$" + returns) : (returns == 0 || returns == null) ? "$-" : ("-$" + returns * -1);

    return (
        <Box width="100%" m="0 30px">
            <Box display="flex" justifyContent="space-between">
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ color: colors.grey[100] }}
                    >
                        {title}
                    </Typography>
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
                    Price & Changes
                </Typography>
            </Box>
            {/* The list of stocks */}
            <Box display="flex" justifyContent="space-between" my="10px">
                <Box display="flex" gap="10px">
                    <img
                        src={"../../stocks_logos/apple.png"}
                        width="50px"
                        height="50px"
                        sx={{ borderRadius: "50%" }}
                        // borderRadius="50%"
                        alt="appleLogo"
                    />
                    <Box display="flex" flexDirection="column" justifyContent="space-between" mt="2px">
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{ color: colors.grey[100] }}
                        >
                            AAPL
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ color: colors.grey[100] }}
                        >
                            Apple Inc.
                        </Typography>
                    </Box>
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="space-between" mt="2px" alignItems="flex-end">
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ color: colors.grey[100] }}
                    >
                        $145.86
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ color: colors.greenAccent[600] }}
                    >
                        +$0.86
                    </Typography>
                </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" my="10px">
                <Box display="flex" gap="10px">
                    <img
                        src={"../../stocks_logos/nvidia.png"}
                        width="50px"
                        height="50px"
                        sx={{ borderRadius: "50%" }}
                        borderRadius="50%"
                    />
                    <Box display="flex" flexDirection="column" justifyContent="space-between" mt="2px">
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{ color: colors.grey[100] }}
                        >
                            NVDA
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ color: colors.grey[100] }}
                        >
                            NVIDIA Corp
                        </Typography>
                    </Box>
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="space-between" mt="2px" alignItems="flex-end">
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ color: colors.grey[100] }}
                    >
                        $145.86
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ color: colors.greenAccent[600] }}
                    >
                        +$0.86
                    </Typography>
                </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" my="10px">
                <Box display="flex" gap="10px">
                    <img
                        src={"../../stocks_logos/microsoft.png"}
                        width="50px"
                        height="50px"
                        sx={{ borderRadius: "50%" }}
                        borderRadius="50%"
                    />
                    <Box display="flex" flexDirection="column" justifyContent="space-between" mt="2px">
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{ color: colors.grey[100] }}
                        >
                            MSFT
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ color: colors.grey[100] }}
                        >
                            Microsoft Corp
                        </Typography>
                    </Box>
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="space-between" mt="2px" alignItems="flex-end">
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ color: colors.grey[100] }}
                    >
                        $145.86
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ color: colors.greenAccent[600] }}
                    >
                        +$0.86
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default PortfolioCard;