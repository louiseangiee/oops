import { Box } from "@mui/material";
import Header from "../../components/Header";

import ComparePortfolioComponent from "../../components/ComparePortfolioComponent";

const ComparePortfolio = () => {
    return (
        <>
            <Box m="20px" alignItems="top">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Header title="Compare Portfolio" subtitle="Compare Portfolio Performance" />
                </Box>
                
                <ComparePortfolioComponent />
            </Box>

        </>
    );
};

export default ComparePortfolio;
