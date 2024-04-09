import { useCustom } from "@refinedev/core";
import { Card, Col, Row, Statistic, Typography } from "antd";
import { capitalize, pick } from "lodash";
import { UserRole } from "../../../enums/user.enum";
import { useIdentity } from "../../../hooks/useIdentity";
import { formatter } from "../../../utils/statistic-formatter";
import LineChart from "./LineChart";
import { PieChart } from "./PieChart";
import { isGuestCanAccess } from "../../../utils/dashboard";

interface IProps {
  roles?: UserRole[];
  query: any;
}

const ContributionStats = ({
  roles = [UserRole.ADMIN, UserRole.MANAGER],
  query,
}: IProps) => {
  const identity = useIdentity();
  const canStats =
    roles.includes(identity.role) &&
    isGuestCanAccess(identity, "/dashboard/contribution-stats");

  const { data: stats, isLoading: isLoadingStats } = useCustom({
    method: "get",
    url: "/dashboard/contribution-stats",
    config: { query },
    queryOptions: { enabled: canStats },
  });

  const { data: timeSeries, isLoading: isLoadingTimeSeries } = useCustom({
    method: "get",
    url: "/dashboard/contribution-time-series",
    config: { query },
    queryOptions: {
      enabled: isGuestCanAccess(
        identity,
        "/dashboard/contribution-time-series"
      ),
    },
  });

  return (
    <>
      <Typography.Title level={3}>Contributions</Typography.Title>
      <>
        <Row gutter={[16, 16]}>
          {stats?.data && canStats && (
            <>
              {Object.keys(
                pick(stats?.data, [
                  "total_contributions",
                  "total_contributors",
                  "total_anonymous_contributions",
                  "total_views",
                ])
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
                      ])
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
                      ])
                    ).map((key) => ({
                      name: capitalize(key.replaceAll("_", " ")),
                      value: stats?.data[key],
                    }))}
                  />
                </Card>
              </Col>
            </>
          )}
          {timeSeries?.data && (
            <Col span={24}>
              <Card bordered={false}>
                <LineChart
                  isLoading={isLoadingTimeSeries}
                  title={{ text: "Contributions time series" }}
                  dataset={{
                    source: timeSeries?.data ?? [],
                    dimensions: [
                      "created_at",
                      "total_contributions",
                      "total_contributors",
                    ],
                  }}
                />
              </Card>
            </Col>
          )}
        </Row>
      </>
    </>
  );
};

export default ContributionStats;
