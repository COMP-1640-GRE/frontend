import { useCustom } from "@refinedev/core";
import { Card, Col, Row, Typography } from "antd";
import { capitalize } from "lodash";
import { UserRole } from "../../../enums/user.enum";
import { useIdentity } from "../../../hooks/useIdentity";
import { PieChart } from "./PieChart";
import { isGuestCanAccess } from "../../../utils/dashboard";

interface IProps {
  roles?: UserRole[];
  query: any;
}

const FacultyStats = ({
  roles = [UserRole.ADMIN, UserRole.MANAGER, UserRole.COORDINATOR],
  query,
}: IProps) => {
  const identity = useIdentity();
  const canStats =
    roles.includes(identity.role) &&
    isGuestCanAccess(identity, "/dashboard/faculty-stats");

  const { data: stats, isLoading: isLoadingStats } = useCustom({
    method: "get",
    url: "/dashboard/faculty-stats",
    config: { query },
    queryOptions: { enabled: canStats },
  });

  return (
    <>
      <Typography.Title level={3}>Faculties</Typography.Title>
      {canStats && stats?.data && (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Card bordered={false}>
                <PieChart
                  isLoading={isLoadingStats}
                  title={{
                    text: "Contributions",
                  }}
                  data={stats?.data.map((items) => ({
                    ...items,
                    value: capitalize(
                      items.total_contributions.replaceAll("_", " ")
                    ),
                  }))}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card bordered={false}>
                <PieChart
                  isLoading={isLoadingStats}
                  title={{
                    text: "Contributors",
                  }}
                  data={stats?.data.map((items) => ({
                    ...items,
                    value: capitalize(
                      items.total_contributors.replaceAll("_", " ")
                    ),
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

export default FacultyStats;
