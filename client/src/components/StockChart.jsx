import React, { useState, useEffect } from 'react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';
import { ButtonGroup, Button } from '@mui/material';
import { tokens } from "../theme";
import { colors } from '@mui/material';
import { getAsync } from '../utils/utils';
import { useCookies } from "react-cookie";


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

const StockChart = ({ chosenStock }) => {
  const [chartData, setChartData] = useState([]);
  const [timeSpan, setTimeSpan] = useState("1Y");
  const [cookie] = useCookies()
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);




  useEffect(() => {
    fetchData();
  }, [chosenStock, timeSpan]);

  const fetchData = async () => {
    let endpoint = 'stocks/oneYearData';  // Default to 1 year data

    switch (timeSpan) {
      case "1Y":
        endpoint = 'stocks/oneYearData';
        break;
      case "1Q":
        endpoint = 'stocks/oneQuarterData';
        break;
      case "1M":
        endpoint = 'stocks/oneMonthData';
        break;
      case "1W":
        endpoint = 'stocks/oneWeekData';
        break;
      default:
        endpoint = 'stocks';
    }

    try {
      console.log(endpoint)
      console.log(chosenStock.code)
      
      const response = await getAsync(`${endpoint}?symbol=${chosenStock.code}`, cookie.accessToken); // Use the accessToken from cookies
      console.log(response)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
      console.log(responseData)

      const data = responseData.map(item => ({
        time: item.date,
        value: parseFloat(item["4. close"])
      }));
      
      setChartData(data.reverse());
    } catch (error) {
      console.error("Failed to fetch stock data:", error);
    }
  };

  // const getTicks = (data) => {
  //   const values = data.map(item => item.value);
  //   const dataMin = Math.max(0,Math.min(...values) - 10);
  //   const dataMax = Math.max(...values) + 10;
  //   const interval = (dataMax - dataMin) / 5;

  //   const ticks = [];
  //   for (let i = 0; i <= 5; i++) {
  //     ticks.push(Math.round(dataMin + interval * i));
  //   }

  //   return ticks;
  // };

  // const ticks = getTicks(chartData);
  // const domainMin = Math.max(0,Math.min(...ticks) - 10);
  // const domainMax = Math.max(...ticks) + 10;

  const [selectedPoint, setSelectedPoint] = useState(null);

  // const displayedData = chartData.reverse();  // Reverse the data
  console.log(chartData)

  return (
    <div>
      <ButtonGroup
        variant="outlined"
        style={{ borderColor: "white", alignContent: "center", marginBottom:"20px"}}
        width="100%"
      >
        <Button
          style={{
            color: timeSpan === "1Y" ? colors.blueAccent[100] : colors.blueAccent[100] ,
            backgroundColor: timeSpan === "1Y" ? colors.greenAccent[600] : "transparent"
          }}
          onClick={() => setTimeSpan("1Y")}
          variant={timeSpan === "1Y" ? "contained" : "outlined"}>
          1 Year
        </Button>
        <Button
          style={{
            color: timeSpan === "1Q" ? colors.blueAccent[100] : colors.blueAccent[100],
            backgroundColor: timeSpan === "1Q" ? colors.greenAccent[600] : "transparent"
          }}
          onClick={() => setTimeSpan("1Q")}
          variant={timeSpan === "1Q" ? "contained" : "outlined"}>
          1 Quarter
        </Button>
        <Button
          style={{
            color: timeSpan === "1M" ? colors.blueAccent[100] : colors.blueAccent[100],
            backgroundColor: timeSpan === "1M" ? colors.greenAccent[600] : "transparent"
          }}
          onClick={() => setTimeSpan("1M")}
          variant={timeSpan === "1M" ? "contained" : "outlined"}>
          1 Month
        </Button>
        <Button
          style={{
            color: timeSpan === "1W" ? colors.blueAccent[100] : colors.blueAccent[100],
            backgroundColor: timeSpan === "1W" ? colors.greenAccent[600] : "transparent"
          }}
          onClick={() => setTimeSpan("1W")}
          variant={timeSpan === "1W" ? "contained" : "outlined'}"} >
          1 Week
        </Button>
      </ButtonGroup>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="time" />
          <YAxis  />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="value" stroke={colors.redAccent[400]} fill={colors.redAccent[500]} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
