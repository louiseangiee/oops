import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import Button from '@mui/material/Button';
import Lottie from 'lottie-react';
import noDataDark from './lotties/no_data_dark.json';
import AddStocks from './AddStocks';
// import noDataLight from './lotties/no_data_light.json';

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

export default function StocksTabs() {
    const [value, setValue] = React.useState(0);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const mockData = {
        "AAPL": {
            "1. open": "140.3700",
            "2. high": "141.2004",
            "3. low": "139.9900",
            "4. close": "141.0700",
            "5. volume": "2637779"
        },
        "TSLA": {
            "1. open": "140.8700",
            "2. high": "141.6400",
            "3. low": "140.0000",
            "4. close": "140.3900",
            "5. volume": "3284421"
        }, "AMZN": {
            "1. open": "145.5100",
            "2. high": "146.1700",
            "3. low": "143.0201",
            "4. close": "143.2400",
            "5. volume": "4824654"
        }, "GOOG": {
            "1. open": "145.9500",
            "2. high": "146.9800",
            "3. low": "145.9200",
            "4. close": "146.5500",
            "5. volume": "2627999"
        }, "FB": {
            "1. open": "146.9400",
            "2. high": "147.7275",
            "3. low": "146.5400",
            "4. close": "146.8300",
            "5. volume": "3885949"
        }, "MSFT": {
            "1. open": "141.7000",
            "2. high": "142.0900",
            "3. low": "140.5600",
            "4. close": "140.6400",
            "5. volume": "3285347"
        }, "NVDA": {
            "1. open": "143.7800",
            "2. high": "145.2200",
            "3. low": "143.3116",
            "4. close": "144.4500",
            "5. volume": "3952640"
        }, "PYPL": {
            "1. open": "135.5300",
            "2. high": "136.4500",
            "3. low": "135.1900",
            "4. close": "135.4800",
            "5. volume": "5519992"
        }, "ABDE": {
            "1. open": "131.7800",
            "2. high": "133.8550",
            "3. low": "131.7500",
            "4. close": "132.0800",
            "5. volume": "2982738"
        }, "NFLX": {
            "1. open": "129.3900",
            "2. high": "131.4100",
            "3. low": "129.3100",
            "4. close": "131.3400",
            "5. volume": "4845649"
        }
    };
    // const mockData = {};

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: colors.primary[400] }} >
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Stocks" {...a11yProps(0)} />
                    <Tab label="Stocks Analytics" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                {Object.keys(mockData).length > 0 ? (
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
                            {Object.keys(mockData).map((stock, index) => (
                                <Box display="flex" justifyContent="space-between" mb="20px" key={index}>
                                    <Box display="flex" gap="10px">
                                        <img
                                            src={"../../stocks_logos/" + "apple.png"}
                                            width="50px"
                                            height="50px"
                                            sx={{ borderRadius: "50%" }}
                                        />

                                        <Box display="flex" flexDirection="column" justifyContent="space-between" mt="2px">
                                            <Typography
                                                variant="h4"
                                                fontWeight="bold"
                                                sx={{ color: colors.grey[100] }}
                                            >
                                                {stock}
                                            </Typography>
                                            <Typography
                                                variant="h6"
                                                sx={{ color: colors.grey[100] }}
                                            >
                                                {stock}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box display="flex" flexDirection="column" justifyContent="space-between" mt="2px" alignItems="flex-end">
                                        <Typography
                                            variant="h4"
                                            fontWeight="bold"
                                            sx={{ color: colors.grey[100] }}
                                        >
                                            ${mockData[stock]["4. close"]}
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            sx={{ color: colors.greenAccent[600] }}
                                        >
                                            +${(mockData[stock]["4. close"] - mockData[stock]["1. open"]).toFixed(3)}
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