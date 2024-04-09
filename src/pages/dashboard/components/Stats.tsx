import { useCustom } from "@refinedev/core";
import { Card, Col, Row, Statistic, Typography } from "antd";
import { StatisticProps } from "antd/lib";
import { capitalize } from "lodash";
import CountUp from "react-countup";
import { UserRole } from "../../../enums/user.enum";
import { useIdentity } from "../../../hooks/useIdentity";

interface IProps {
  title: string;
  url: string;
  roles?: UserRole[];
  query: any;
}

const formatter: StatisticProps["formatter"] = (value) => (
  <CountUp end={value as number} separator="," />
);

const Stats = ({
  title,
  url,
  roles = [UserRole.ADMIN, UserRole.MANAGER],
  query,
}: IProps) => {
  const { role } = useIdentity();
  const canView = role && roles.includes(role);

  const { data } = useCustom({
    method: "get",
    url,
    config: { query },
    queryOptions: { enabled: canView },
  });

  if (!canView) {
    return null;
  }

  return (
    <>
      <Typography.Title level={3}>{title}</Typography.Title>
      <Row gutter={[16, 16]}>
        {data?.data &&
          Object.keys(data?.data).map((key, index) => (
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
      </Row>
    </>
  );
};

export default Stats;
