import { useCustom } from "@refinedev/core";
import { Card, Col, Row, Statistic, Typography } from "antd";
import { capitalize, pick } from "lodash";
import { UserRole } from "../../../enums/user.enum";
import { useIdentity } from "../../../hooks/useIdentity";
import { PieChart } from "./PieChart";
import { formatter } from "../../../utils/statistic-formatter";
import { isGuestCanAccess } from "../../../utils/dashboard";

interface IProps {
  roles?: UserRole[];
  query: any;
}

const UserStats = ({
  roles = [UserRole.ADMIN, UserRole.MANAGER],
  query,
}: IProps) => {
  const identity = useIdentity();
  const canView =
    roles.includes(identity.role) &&
    isGuestCanAccess(identity, "/dashboard/users-stats");

  const { data: stats, isLoading } = useCustom({
    method: "get",
    url: "/dashboard/users-stats",
    config: { query },
    queryOptions: { enabled: canView },
  });

  return (
    <>
      {canView && (
        <>
          <Typography.Title level={3}>User</Typography.Title>
          {stats?.data && (
            <>
              <Row gutter={[16, 16]}>
                {Object.keys(
                  pick(stats?.data, ["total_users", "total_faculties"])
                ).map((key) => (
                  <Col key={key} span={8} xs={24} sm={12}>
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
                      isLoading={isLoading}
                      title={{
                        text: "Roles",
                      }}
                      data={Object.keys(
                        pick(stats?.data, [
                          "role_student",
                          "role_guest",
                          "role_administrator",
                          "role_university_marketing_manager",
                          "role_faculty_marketing_coordinator",
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
                      isLoading={isLoading}
                      title={{
                        text: "Status",
                      }}
                      data={Object.keys(
                        pick(stats?.data, [
                          "status_locked",
                          "status_active",
                          "status_inactive",
                        ])
                      ).map((key) => ({
                        name: capitalize(key.replaceAll("_", " ")),
                        value: stats?.data[key],
                      }))}
                    />
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </>
      )}
    </>
  );
};

export default UserStats;
