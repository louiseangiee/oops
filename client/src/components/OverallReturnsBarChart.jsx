import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { ButtonGroup, Button } from '@mui/material';
import { tokens } from "../theme";
import { getAsync } from '../utils/utils';
import { useCookies } from "react-cookie";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'; // importing the necessary chart components from recharts

const PorfolioBarChart = ({ UserPortfolios }) => {
    const [chartData, setChartData] = useState([]);
    const [timeSpan, setTimeSpan] = useState("7D");
    const [cookie, removeCookie] = useCookies(["accessToken"])
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        // fetch the data for the past 7 days
        async function fetchData() {
            try {
                const response = await getAsync("/api/path_to_fetch_data", {
                    headers: {
                        Authorization: `Bearer ${cookie.accessToken}`,
                    },
                });
                
                // Assuming the response contains an array of data where each item has a 'date' and 'return' property
                setChartData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [cookie]);

    return (
        <div>
            <BarChart width={500} height={300} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="return" fill={colors.primary} />
            </BarChart>
        </div>
    );
}

export default PorfolioBarChart;
