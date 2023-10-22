import { TableCell, TableHead } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';
import { tokens } from "../theme";

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
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    // Fetch data based on the chosen stock
    if (!chosenStock) {
      return;
    }
    import(`../data/${chosenStock.code}Data.json`)
      .then(module => {
        loadData(module.default);
      })
      .catch(err => {
        console.error("Failed to load stock data:", err);
      });
  }, [chosenStock]);

  const loadData = (data) => {
    const parsedData = Object.entries(data["Time Series (Daily)"]).map(([date, values]) => {
      return {
        time: date,
        value: parseFloat(values["4. close"])
      };
    });

    setChartData(parsedData);
  }



  const getTicks = (data) => {
    const values = data.map(item => item.value);
    const dataMin = Math.min(...values) - 10;
    const dataMax = Math.max(...values) + 10;
    const interval = (dataMax - dataMin) / 5;

    const ticks = [];
    for (let i = 0; i <= 5; i++) {
      ticks.push(Math.round(dataMin + interval * i));
    }

    return ticks;
  };

  const ticks = getTicks(chartData);
  const domainMin = Math.min(...ticks) - 10;
  const domainMax = Math.max(...ticks) + 10;

  const [selectedPoint, setSelectedPoint] = useState(null);

  const handlePointClick = (data, index) => {
    setSelectedPoint(data);
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="time" />
          <YAxis domain={[domainMin, domainMax]} ticks={ticks} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="value" stroke={colors.redAccent[400]} fill={colors.redAccent[500]} />
        </AreaChart>



      </ResponsiveContainer>

    </div>


  );
};

export default StockChart;
