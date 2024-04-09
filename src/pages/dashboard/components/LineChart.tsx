import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";
import dayjs from "../../../libs/dayjs";

interface IProps extends EChartsOption {
  isLoading: boolean;
}

const LineChart = ({ isLoading, ...rest }: IProps) => {
  return (
    <ReactECharts
      option={{
        legend: {
          bottom: "bottom",
          left: "left",
          icon: "circle",
          orient: "horizontal",
        },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "4%",
          right: "6%",
          top: "10%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          splitLine: { show: true },
          axisLabel: {
            formatter: (value) => dayjs(value).utc(true).format("DD/MM/YYYY"),
          },
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: false,
          },
          minInterval: 1,
        },
        ...rest,
        series: [
          {
            type: "line",
            emphasis: { focus: "series" },
          },
          ...Array.from({
            length: (rest.dataset?.["dimensions"]?.length || 0) - 2,
          }).map(() => ({
            type: "bar",
            itemStyle: {
              color: "transparent",
            },
          })),
        ],
      }}
      showLoading={isLoading}
    />
  );
};

export default LineChart;
