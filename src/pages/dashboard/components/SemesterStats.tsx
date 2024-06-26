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

const SemesterStats = ({
  roles = [UserRole.ADMIN, UserRole.MANAGER, UserRole.COORDINATOR],
  query,
}: IProps) => {
  const identity = useIdentity();
  const canView =
    roles.includes(identity.role) &&
    isGuestCanAccess(identity, "/dashboard/semester-stats");

  const { data, isLoading } = useCustom({
    method: "get",
    url: "/dashboard/semester-stats",
    config: { query },
    queryOptions: { enabled: canView },
  });

  if (!canView) {
    return null;
  }

  return (
    <>
      <Typography.Title level={3}>Semesters</Typography.Title>
      {data?.data && (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Card bordered={false}>
                <PieChart
                  isLoading={isLoading}
                  title={{
                    text: "Contributions",
                  }}
                  data={data?.data.map((items) => ({
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
                  isLoading={isLoading}
                  title={{
                    text: "Contributors",
                  }}
                  data={data?.data.map((items) => ({
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

export default SemesterStats;
