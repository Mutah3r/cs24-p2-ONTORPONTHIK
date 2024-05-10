import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ThirdPartyChart = ({ latestData }) => {
  let result = latestData
    ? Object.keys(latestData).map((date) => {
        return {
          name: date,
          "Total Bill(BDT)": latestData[date].totalBill,
          "Total Waste(kg)": parseFloat(latestData[date].totalWaste) * 1000,
        };
      })
    : [];

  result = result.sort((a, b) => {
    const dateA = new Date(a.name);
    const dateB = new Date(b.name);
    return dateA - dateB;
  });

  console.log(result);

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={result}
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
          <Bar dataKey="Total Bill(BDT)" fill="#737373" />
          <Bar dataKey="Total Waste(kg)" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ThirdPartyChart;
