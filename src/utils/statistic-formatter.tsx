import { StatisticProps } from "antd";
import CountUp from "react-countup";

export const formatter: StatisticProps["formatter"] = (value) => (
  <CountUp end={value as number} separator="," />
);
