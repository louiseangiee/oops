import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import Button from '@mui/material/Button';
import Lottie from 'lottie-react';
import AddStocks from './AddStocks';
import noDataDark from './lotties/no_data_dark.json';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3, backgroundColor: colors.primary[400] }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function StocksTabs({ stocks }) {
    const [value, setValue] = React.useState(0);
    const theme = useTheme();
    console.log(stocks);
    const colors = tokens(theme.palette.mode);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: colors.primary[400] }} >
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" TabIndicatorProps={{
                    style: {
                        backgroundColor: colors.greenAccent[400], // Change the color to your desired color
                    },
                }}>
                    <Tab label="Stocks" {...a11yProps(0)}
                        sx={{
                            '&.Mui-selected': {
                                color: colors.greenAccent[400], // Change the color to your desired color
                            },
                            '&.Mui-selected:hover': {
                                color: colors.greenAccent[400], // Color for the active tab when hovered
                            },
                            '&:not(.Mui-selected)': {
                                color: colors.primary[100], // Color for non-selected tabs
                                '&:hover': {
                                    color: colors.blueAccent[400], // Color for non-selected tabs when hovered
                                },
                            },
                        }} />
                    <Tab label="Stocks Analytics" {...a11yProps(1)}
                        sx={{
                            '&.Mui-selected': {
                                color: colors.greenAccent[400], // Change the color to your desired color
                            },
                            '&.Mui-selected:hover': {
                                color: colors.greenAccent[400], // Color for the active tab when hovered
                            },
                            '&:not(.Mui-selected)': {
                                color: colors.primary[100], // Color for non-selected tabs
                                '&:hover': {
                                    color: colors.blueAccent[400], // Color for non-selected tabs when hovered
                                },
                            },
                        }} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                {stocks && stocks?.length > 0 ? (
                    <Box display="flex" flexDirection="column">
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb="20px">
                            <Typography variant="h3" fontWeight="bold" color={colors.grey[100]}>
                                Stocks
                            </Typography>
                            <AddStocks />
                        </Box>
                        <Box display="flex" flexDirection="column" gap="20px" mb="10px">
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="h6" fontStyle="italic" color={colors.grey[300]}>
                                    Stock
                                </Typography>
                                <Typography variant="h6" fontStyle="italic" color={colors.grey[300]}>
                                    Value
                                </Typography>
                            </Box>
                        </Box>
                        <Box>
                            {stocks.map((stock, index) => (
                                <Box display="flex" justifyContent="space-between" mb="20px" key={index}>
                                    <Box display="flex" gap="10px">
                                        <img
                                            src={"../../stocks_logos/" + "apple.png"}
                                            width="50px"
                                            height="50px"
                                            sx={{ borderRadius: "50%" }}
                                            alt='apple'
                                        />

                                        <Box display="flex" flexDirection="column" justifyContent="space-between" mt="2px">
                                            <Typography
                                                variant="h4"
                                                fontWeight="bold"
                                                sx={{ color: colors.grey[100] }}
                                            >
                                                {stock.stockSymbol}
                                            </Typography>
                                            <Typography
                                                variant="h6"
                                                sx={{ color: colors.grey[100] }}
                                            >
                                                {stock.stockIndustry}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box display="flex" flexDirection="column" justifyContent="space-between" mt="2px" alignItems="flex-end">
                                        <Typography
                                            variant="h4"
                                            fontWeight="bold"
                                            sx={{ color: colors.grey[100] }}
                                        >
                                            ${stock.buyPrice}
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            sx={{ color: colors.greenAccent[600] }}
                                        >
                                            Qty: {stock.quantity}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                ) :
                    (<Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" mb="20px">
                        <Lottie
                            animationData={noDataDark}
                            loop={true} // Set to true for looping
                            autoplay={true} // Set to true to play the animation automatically
                            style={{ width: '200px', height: '200px' }} // Customize the dimensions
                        />
                        <AddStocks />
                    </Box>)
                }
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                Stocks Analytics
            </CustomTabPanel>
        </Box>
    );
}