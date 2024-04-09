import { useCustom } from "@refinedev/core";
import { Card, Col, Row, Statistic, Typography } from "antd";
import { StatisticProps } from "antd/lib";
import { capitalize, pick } from "lodash";
import CountUp from "react-countup";
import { UserRole } from "../../../enums/user.enum";
import { useIdentity } from "../../../hooks/useIdentity";
import LineChart from "./LineChart";
import { PieChart } from "./PieChart";

interface IProps {
  roles?: UserRole[];
  query: any;
}

const formatter: StatisticProps["formatter"] = (value) => (
  <CountUp end={value as number} separator="," />
);

const ContributionStats = ({
  roles = [UserRole.ADMIN, UserRole.MANAGER],
  query,
}: IProps) => {
  const { role } = useIdentity();
  const canView = role && roles.includes(role);

  const { data: stats, isLoading: isLoadingStats } = useCustom({
    method: "get",
    url: "/dashboard/contribution-stats",
    config: { query },
    queryOptions: { enabled: canView },
  });

  const { data: timeSeries, isLoading: isLoadingTimeSeries } = useCustom({
    method: "get",
    url: "/dashboard/contribution-time-series",
    config: { query },
    queryOptions: { enabled: canView },
  });

  if (!canView) {
    return null;
  }

  return (
    <>
      <Typography.Title level={3}>Contributions</Typography.Title>
      {stats?.data && (
        <>
          <Row gutter={[16, 16]}>
            {Object.keys(
              pick(stats?.data, [
                "total_contributions",
                "total_contributors",
                "total_anonymous_contributions",
                "total_views",
              ]),
            ).map((key, index) => (
              <Col key={index} span={8} xs={24} sm={12} lg={6}>
                <Card bordered={false}>
                  <Statistic
                    title={capitalize(key.replaceAll("_", " "))}
                    value={stats?.data[key]}
                    formatter={formatter}
                  />
                </Card>
              </Col>
            ))}
            <Col xs={24} sm={12}>
              <Card bordered={false}>
                <PieChart
                  isLoading={isLoadingStats}
                  title={{
                    text: "Status",
                  }}
                  data={Object.keys(
                    pick(stats?.data, [
                      "status_pending",
                      "status_approved",
                      "status_rejected",
                    ]),
                  ).map((key) => ({
                    name: capitalize(key.replaceAll("_", " ")),
                    value: stats?.data[key],
                  }))}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card bordered={false}>
                <PieChart
                  isLoading={isLoadingStats}
                  title={{
                    text: "Evaluations",
                  }}
                  data={Object.keys(
                    pick(stats?.data, [
                      "evaluation_good",
                      "evaluation_normal",
                      "evaluation_bad",
                    ]),
                  ).map((key) => ({
                    name: capitalize(key.replaceAll("_", " ")),
                    value: stats?.data[key],
                  }))}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card bordered={false}>
                <LineChart
                  isLoading={isLoadingStats}
                  title={{ text: "Contributions time series" }}
                  dataset={{
                    source: timeSeries?.data ?? [],
                    dimensions: ["created_at", "total_contributions"],
                  }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card bordered={false}>
                <LineChart
                  isLoading={isLoadingStats}
                  title={{ text: "Contributors time series" }}
                  dataset={{
                    source: timeSeries?.data ?? [],
                    dimensions: ["created_at", "total_contributors"],
                  }}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ContributionStats;
