import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";

interface IProps extends EChartsOption {
  isLoading: boolean;
  data: any;
}

export const PieChart = ({ isLoading, data, ...rest }: IProps) => {
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
          trigger: "item",
        },
        ...rest,
        series: [
          {
            type: "pie",
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            data,
          },
        ],
      }}
      showLoading={isLoading}
    />
  );
};
