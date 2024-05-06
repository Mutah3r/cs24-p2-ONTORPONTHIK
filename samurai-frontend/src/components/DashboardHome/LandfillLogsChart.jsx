import React from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LandfillLogsChart = ({logsData}) => {
  // Helper function to get the current date minus a number of days
  const getDateDaysAgo = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];  // Format as "YYYY-MM-DD"
  };

  // Prepare the date range for the last 7 days
  const startDate = getDateDaysAgo(6); // 6 days ago plus today makes 7 days

  // Filter and process the data
  const processLast7DaysData = (logsData) => {
    const totals = {};

    // Initialize totals for each day in the last 7 days
    for (let i = 0; i < 7; i++) {
        const dateKey = getDateDaysAgo(6 - i);
        totals[dateKey] = { weight_of_waste: 0, number_of_entries: 0, weekday: new Date(dateKey).toLocaleDateString('en-US', { weekday: 'long' }) };
    }

    // Filter and aggregate logsData
    logsData && logsData.forEach(item => {
        const arrivalDate = item.time_of_arrival.split('T')[0];
        if (arrivalDate >= startDate) {
            if (totals[arrivalDate]) {
                totals[arrivalDate].weight_of_waste += item.weight_of_waste;
                totals[arrivalDate].number_of_entries += 1;
            }
        }
    });

    return totals;
  };

  const last7DaysData = processLast7DaysData(logsData);
  console.log(last7DaysData);

  const shortDayNames = {
    "Monday": "Mon",
    "Tuesday": "Tue",
    "Wednesday": "Wed",
    "Thursday": "Thu",
    "Friday": "Fri",
    "Saturday": "Sat",
    "Sunday": "Sun"
  };

  const data = Object.keys(last7DaysData).map(date => {
    const dayData = last7DaysData[date];
    return {
        name: shortDayNames[dayData.weekday],
        "Vehicle Entering": dayData.number_of_entries,
        "Waste Collected(Ton)": dayData.weight_of_waste,
    };
  });

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <Tooltip />
          <Legend />
          <Bar dataKey="Waste Collected(Ton)" fill="#737373" />
          <Bar dataKey="Vehicle Entering" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LandfillLogsChart;
