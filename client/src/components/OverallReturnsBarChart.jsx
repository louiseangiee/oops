import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { ButtonGroup, Button, Typography } from '@mui/material';
import { tokens } from "../theme";
import { getAsync } from '../utils/utils';
import { useCookies } from "react-cookie";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'; // importing the necessary chart components from recharts


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc', color: "black" }}>
        <p className="label">{`Date: ${label}`}</p>
        <p className="value">{`Value: $${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }

  return null;
};

const PorfolioBarChart = () => {
  const [chartData, setChartData] = useState([]);
  const [timeSpan, setTimeSpan] = useState("7D");
  const [cookie, removeCookie] = useCookies();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dummyData = [
    { date: '2023-10-10', return: 2.45 },
    { date: '2023-10-09', return: -1.32 },
    { date: '2023-10-08', return: 0.78 },
    { date: '2023-10-07', return: -1.32 },
    { date: '2023-10-06', return: 2.45 },
    { date: '2023-10-05', return: 0.78 },
    { date: '2023-10-04', return: 2.90 },
    { date: '2023-10-03', return: 0.78 }

  ];


  useEffect(() => {
    // Instead of fetchData(), set chartData with the dummy data

    setChartData(dummyData);
  }, []);

  // useEffect(() => {
  //     fetchData();
  //   }, [chosenStock, timeSpan]);



  //   const fetchData = async () => {
  //     let endpoint = 'stocks/OneYearData';  // Default to 1 year data

  //     switch (timeSpan) {
  //       case "1Y":
  //         endpoint = 'stocks/OneYearData';
  //         break;
  //       case "1Q":
  //         endpoint = 'stocks/OneQuarterData';
  //         break;
  //       case "1M":
  //         endpoint = 'stocks/OneMonthData';
  //         break;
  //       case "1W":
  //         endpoint = 'stocks/OneWeekData';
  //         break;
  //       default:
  //         endpoint = 'stocks';
  //     }

  //     try {

  //       const response = await getAsync(`${endpoint}?symbol=${chosenStock.code}`, cookie.accessToken); // Use the accessToken from cookies
  //       console.log(response)
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       const responseData = await response.json();
  //       console.log(responseData)

  //       const data = responseData.map(item => ({
  //         time: item.date,
  //         value: parseFloat(item["4. close"])
  //       }));
  //       setChartData(data);
  //     } catch (error) {
  //       console.error("Failed to fetch stock data:", error);
  //     }
  //   };

  const displayedData = chartData.reverse();

  return (
    <><Typography variant="h2" fontWeight="bold" mb={5}>
      Overall Returns in Past 7 Days
    </Typography>

      <BarChart width={500} height={300} data={displayedData}>

        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="return" fill={colors.greenAccent[600]} />
      </BarChart></>

  );
}

export default PorfolioBarChart;
