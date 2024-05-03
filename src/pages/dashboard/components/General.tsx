import { useCustom } from "@refinedev/core";
import { Card, Col, Row, Typography } from "antd";
import LineChart from "./LineChart";
import { useIdentity } from "../../../hooks/useIdentity";
import { isGuestCanAccess } from "../../../utils/dashboard";

interface IProps {
  query: any;
}

const General = ({ query }: IProps) => {
  const identity = useIdentity();

  const { data: reaction, isLoading: isLoadingReaction } = useCustom({
    method: "get",
    url: "/dashboard/reaction-time-series",
    config: { query },
    queryOptions: {
      enabled: isGuestCanAccess(identity, "/dashboard/reaction-time-series"),
    },
  });
  const { data: comment, isLoading: isLoadingComment } = useCustom({
    method: "get",
    url: "/dashboard/comment-time-series",
    config: { query },
    queryOptions: {
      enabled: isGuestCanAccess(identity, "/dashboard/comment-time-series"),
    },
  });
  const { data: review, isLoading: isLoadingReview } = useCustom({
    method: "get",
    url: "/dashboard/review-time-series",
    config: { query },
    queryOptions: {
      enabled: isGuestCanAccess(identity, "/dashboard/review-time-series"),
    },
  });
  const { data: notification, isLoading: isLoadingNotification } = useCustom({
    method: "get",
    url: "/dashboard/notification-time-series",
    config: { query },
    queryOptions: {
      enabled: isGuestCanAccess(
        identity,
        "/dashboard/notification-time-series"
      ),
    },
  });

  return (
    <>
      <Typography.Title level={3}>General</Typography.Title>
      <Row gutter={[16, 16]}>
        <>
          {reaction?.data && (
            <Col xs={24} sm={12}>
              <Card bordered={false}>
                <LineChart
                  isLoading={isLoadingReaction}
                  title={{ text: "Reactions time series" }}
                  dataset={{
                    source: reaction?.data ?? [],
                    dimensions: [
                      "created_at",
                      "total_reactions",
                      "total_reactors",
                    ],
                  }}
                />
              </Card>
            </Col>
          )}
          {comment?.data && (
            <Col xs={24} sm={12}>
              <Card bordered={false}>
                <LineChart
                  isLoading={isLoadingComment}
                  title={{ text: "Comments time series" }}
                  dataset={{
                    source: comment?.data ?? [],
                    dimensions: [
                      "created_at",
                      "total_comments",
                      "total_commenters",
                    ],
                  }}
                />
              </Card>
            </Col>
          )}
          {review?.data && (
            <Col xs={24} sm={12}>
              <Card bordered={false}>
                <LineChart
                  isLoading={isLoadingReview}
                  title={{ text: "Reviews time series" }}
                  dataset={{
                    source: review?.data ?? [],
                    dimensions: [
                      "created_at",
                      "total_reviews",
                      "total_reviewers",
                    ],
                  }}
                />
              </Card>
            </Col>
          )}
          {notification?.data && (
            <Col xs={24} sm={12}>
              <Card bordered={false}>
                <LineChart
                  isLoading={isLoadingNotification}
                  title={{ text: "Notifications time series" }}
                  dataset={{
                    source: notification?.data ?? [],
                    dimensions: [
                      "created_at",
                      "total_notifications",
                      "total_users",
                    ],
                  }}
                />
              </Card>
            </Col>
          )}
        </>
      </Row>
    </>
  );
};

export default General;
