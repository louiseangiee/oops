import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Checkbox from '@mui/material/Checkbox';
import Tab from '@mui/material/Tab';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import Button from '@mui/material/Button';
import Lottie from 'lottie-react';
import AddStocks from './AddStocks';
import noDataDark from './lotties/no_data_dark.json';
import { deleteAsync } from '../utils/utils';
import { useCookies } from "react-cookie";
import { useAuth } from '../context/AuthContext';

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

function DeleteStock({ isVisible, checkedItems, onStocksDeleted, portfolioId }) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [cookie] = useCookies();
    const { userData } = useAuth()

    const handleDelete = async () => {
        for (let stockSymbol of checkedItems) {
            const response = await deleteAsync(`portfolioStocks/${portfolioId}/stocks/${stockSymbol}/drop`, cookie.accessToken);
            // Check for a successful response and handle any errors as needed
            if (response.ok) {
                console.log("Stock deleted successfully");
            } else {
                console.log("Error deleting stock(s)");

            }
        }

        onStocksDeleted(checkedItems); // Notify parent component that stocks have been deleted
    }

    return (
        isVisible ? (
            <Button
                sx={{
                    color: colors.grey[100],
                    backgroundColor: colors.redAccent[600],
                    borderColor: colors.redAccent[600],
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                }}
                onClick={handleDelete}
            >
                Delete Stocks
            </Button>
        ) : null
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

export default function StocksTabs({ stocks, portfolioId }) {
    const [value, setValue] = React.useState(0);
    const theme = useTheme();
    console.log(stocks);
    const colors = tokens(theme.palette.mode);

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const [checkedItems, setCheckedItems] = React.useState([]);

    const onStocksDeleted = (deletedStockSymbols) => {
        // Filter out the deleted stocks from the current stocks list
        const updatedStocks = stocks.filter(stock => !deletedStockSymbols.includes(stock.stockSymbol));

        // Update the state (You'll need to lift the stocks state up if it's coming from a parent or fetched within this component)
        // setStocks(updatedStocks); // Uncomment this line if you have a setStocks function

        // Clear the checked items list
        setCheckedItems([]);
    };

    const handleCheckboxChange = (event, stockSymbol) => {
        if (event.target.checked) {
            setCheckedItems((prev) => [...prev, stockSymbol]);
        } else {
            setCheckedItems((prev) => prev.filter((item) => item !== stockSymbol));
        }
    };


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
                            <Box display="flex" gap="20px">
                                <AddStocks portfolioId={portfolioId} />
                                <DeleteStock isVisible={checkedItems.length > 0} checkedItems={checkedItems}
                                    portfolioId={portfolioId}
                                    onStocksDeleted={onStocksDeleted}
                                />
                            </Box>

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

                                        <Checkbox
                                            {...label}
                                            checked={checkedItems.includes(stock.stockSymbol)}
                                            onChange={(e) => handleCheckboxChange(e, stock.stockSymbol)}
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: colors.blueAccent[400],
                                                }
                                            }}
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
                        <AddStocks portfolioId={portfolioId} />
                    </Box>)
                }
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                Stocks Analytics
            </CustomTabPanel>
        </Box>
    );
}