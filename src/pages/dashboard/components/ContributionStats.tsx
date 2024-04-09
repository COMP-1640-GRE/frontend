import { useCustom } from "@refinedev/core";
import { Card, Col, Row, Statistic, Typography } from "antd";
import { StatisticProps } from "antd/lib";
import { capitalize, pick } from "lodash";
import CountUp from "react-countup";
import { UserRole } from "../../../enums/user.enum";
import { useIdentity } from "../../../hooks/useIdentity";
import { PieChart } from "./PieChart";

interface IProps {
  roles?: UserRole[];
}

const formatter: StatisticProps["formatter"] = (value) => (
  <CountUp end={value as number} separator="," />
);

const ContributionStats = ({
  roles = [UserRole.ADMIN, UserRole.MANAGER],
}: IProps) => {
  const { role } = useIdentity();
  const canView = role && roles.includes(role);

  const { data, isLoading } = useCustom({
    method: "get",
    url: "/dashboard/contribution-stats",
    queryOptions: { enabled: canView },
  });

  if (!canView) {
    return null;
  }

  return (
    <>
      <Typography.Title level={3}>Contributions</Typography.Title>
      {data?.data && (
        <>
          <Row gutter={[16, 16]}>
            {Object.keys(
              pick(data?.data, [
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
                    value={data?.data[key]}
                    formatter={formatter}
                  />
                </Card>
              </Col>
            ))}
            <Col xs={24} sm={12}>
              <Card bordered={false}>
                <PieChart
                  isLoading={isLoading}
                  title={{
                    text: "Status",
                  }}
                  data={Object.keys(
                    pick(data?.data, [
                      "status_pending",
                      "status_approved",
                      "status_rejected",
                    ])
                  ).map((key) => ({
                    name: capitalize(key.replaceAll("_", " ")),
                    value: data?.data[key],
                  }))}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card bordered={false}>
                <PieChart
                  isLoading={isLoading}
                  title={{
                    text: "Evaluations",
                  }}
                  data={Object.keys(
                    pick(data?.data, [
                      "evaluation_good",
                      "evaluation_normal",
                      "evaluation_bad",
                    ])
                  ).map((key) => ({
                    name: capitalize(key.replaceAll("_", " ")),
                    value: data?.data[key],
                  }))}
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
