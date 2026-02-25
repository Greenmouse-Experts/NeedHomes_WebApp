import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";

// #region Sample data
const data = [
  {
    name: "Jan",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Feb",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Mar",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Apr",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "May",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Jun",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Jul",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "Aug",
    uv: 3000,
    pv: 4500,
    amt: 2300,
  },
  {
    name: "Sep",
    uv: 2500,
    pv: 3200,
    amt: 2000,
  },
  {
    name: "Oct",
    uv: 3800,
    pv: 4000,
    amt: 2600,
  },
  {
    name: "Nov",
    uv: 3200,
    pv: 3500,
    amt: 2200,
  },
  {
    name: "Dec",
    uv: 4500,
    pv: 5000,
    amt: 2800,
  },
];
// #endregion

export default function Example() {
  return (
    <div className="ring fade shadow rounded-box">
      <h2 className="p-4 border-b fade font-semibold text-lg ">
        Monthly Analysis
      </h2>
      <section className="h-120 w-full overflow-x-scroll p-4">
        <div className="size-full min-w-[520px] ">
          <ResponsiveContainer className={"min-w-[520px]"}>
            <LineChart
              // style={{
              //   width: "100%",
              //   height: "100%",
              //   maxHeight: "70vh",
              //   aspectRatio: 1.618,
              // }}
              className="flex-1 aspect-video "
              responsive
              data={data}
              margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis width="auto" />
              <Tooltip />
              {/*<Legend />*/}
              <Line
                type="monotone"
                dataKey="pv"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
              <RechartsDevtools />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
