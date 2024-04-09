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
  query: any;
}

const formatter: StatisticProps["formatter"] = (value) => (
  <CountUp end={value as number} separator="," />
);

const UserStats = ({
  roles = [UserRole.ADMIN, UserRole.MANAGER],
  query,
}: IProps) => {
  const { role } = useIdentity();
  const canView = role && roles.includes(role);

  const { data, isLoading } = useCustom({
    method: "get",
    url: "/dashboard/users-stats",
    config: { query },
    queryOptions: { enabled: canView },
  });

  if (!canView) {
    return null;
  }

  return (
    <>
      <Typography.Title level={3}>User</Typography.Title>
      {data?.data && (
        <>
          <Row gutter={[16, 16]}>
            {Object.keys(
              pick(data?.data, ["total_users", "total_faculties"]),
            ).map((key, index) => (
              <Col key={index} span={8} xs={24} sm={12}>
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
                    text: "Roles",
                  }}
                  data={Object.keys(
                    pick(data?.data, [
                      "role_student",
                      "role_guest",
                      "role_administrator",
                      "role_university_marketing_manager",
                      "role_faculty_marketing_coordinator",
                    ]),
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
                    text: "Status",
                  }}
                  data={Object.keys(
                    pick(data?.data, [
                      "status_locked",
                      "status_active",
                      "status_inactive",
                    ]),
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

export default UserStats;
