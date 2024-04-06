import { Comment } from "@ant-design/compatible";
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { DateField, EmailField, Show, TextField } from "@refinedev/antd";
import {
  BaseRecord,
  IResourceComponentsProps,
  useCustomMutation,
  useDelete,
  useInvalidate,
  useShow,
} from "@refinedev/core";
import {
  Avatar,
  Button,
  Card,
  Carousel,
  Col,
  List,
  Popover,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import React from "react";
import ContributionStatusTag from "../../components/elements/ContributionStatusTag";
import ContributionTag from "../../components/elements/ContributionTag";
import EvaluateTag from "../../components/elements/EvaluateTag";
import ReviewEditor from "../../components/elements/ReviewEditor";
import {
  ContributionEvaluate,
  ContributionStatus,
} from "../../enums/contribution.enum";
import { UserRole } from "../../enums/user.enum";
import { useIdentity } from "../../hooks/useIdentity";
import dayjs from "../../libs/dayjs";

const { Title } = Typography;

export const ContributionManagementShow: React.FC<
  IResourceComponentsProps
> = () => {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;
  const { id, role } = useIdentity();
  const record = data?.data;
  const canEdit = id === record?.author?.id;

  const invalidate = useInvalidate();
  const { mutate, isLoading: isLoadingMutation } = useCustomMutation();
  const invalidates = () =>
    invalidate({
      resource: "contributions",
      id: record?.id,
      invalidates: ["detail"],
    });

  const { mutate: deleteMutation } = useDelete();
  const [editingRecord, setEditingRecord] = React.useState<BaseRecord>();

  return (
    <Space direction="vertical" className="w-full">
      <Show
        isLoading={isLoading}
        canEdit={canEdit}
        canDelete={false}
        title={""}
        headerButtons={({ defaultButtons }) => (
          <>
            {defaultButtons}
            {role === UserRole.MANAGER && (
              <Button
                type="primary"
                loading={isLoadingMutation}
                onClick={() =>
                  mutate(
                    {
                      method: "patch",
                      url: `/contributions/${record?.id}/select`,
                      values: {},
                      successNotification: {
                        message: "Contribution Selected",
                        type: "success",
                      },
                    },
                    {
                      onSuccess: invalidates,
                    }
                  )
                }
              >
                Toggle select
              </Button>
            )}
            {role === UserRole.COORDINATOR && (
              <>
                <Select
                  maxCount={1}
                  loading={isLoadingMutation}
                  value={record?.evaluation}
                  onChange={(evaluation) =>
                    mutate(
                      {
                        method: "patch",
                        url: `/contributions/${record?.id}/evaluate`,
                        values: { evaluation },
                        successNotification: {
                          message: `Contribution evaluated as ${evaluation}`,
                          type: "success",
                        },
                      },
                      {
                        onSuccess: invalidates,
                      }
                    )
                  }
                  options={Object.values(ContributionEvaluate).map((value) => ({
                    value,
                    label: <EvaluateTag evaluation={value} />,
                  }))}
                />
                <Select
                  maxCount={1}
                  loading={isLoadingMutation}
                  value={record?.status}
                  onChange={(status) =>
                    mutate(
                      {
                        method: "patch",
                        url: `/contributions/${record?.id}/status`,
                        values: { status },
                        successNotification: {
                          message: `Contribution status changed to ${status}`,
                          type: "success",
                        },
                      },
                      {
                        onSuccess: invalidates,
                      }
                    )
                  }
                  options={Object.values(ContributionStatus).map((value) => ({
                    value,
                    label: <ContributionStatusTag status={value} />,
                  }))}
                />
              </>
            )}
          </>
        )}
      >
        <div className="flex flex-col md:flex-row pb-10 items-start justify-between gap-4">
          <div>
            <ContributionStatusTag status={record?.status} />
            {record?.evaluation && (
              <EvaluateTag evaluation={record?.evaluation} />
            )}
            <ContributionTag contribution={record as any} />
            <Title level={3}>{record?.title}</Title>
            <DateField
              value={record?.created_at}
              format="[Posted at:] YYYY-MM-DD HH:mm:ss"
            />
          </div>
          {record?.author ? (
            <div className="flex flex-row items-center gap-4">
              <Avatar src={record?.author?.avatar} size={84} shape="square" />
              <div>
                <p>{record?.author?.faculty?.name}</p>
                <Title level={4}>{record?.author?.full_name}</Title>
                <EmailField value={record?.author?.email} />
              </div>
            </div>
          ) : (
            <div>Anonymous</div>
          )}
        </div>
        <Carousel autoplay>
          {record?.attachments
            ?.filter((item: any) => item.type === "image")
            .map((item: any) => (
              <div key={item.id} className="aspect-video">
                <img
                  src={item.path}
                  alt={item.name}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            ))}
        </Carousel>
        <Row gutter={[16, 16]}>
          <Col span={24} md={18}>
            <Title level={5}>Description</Title>
            <TextField value={record?.description ?? ""} />
          </Col>
          <Col span={24} md={6}>
            <Title level={5}>Files</Title>
            <Card>
              {record?.attachments.map((item: any) => (
                <div key={item.id}>
                  <a href={item.path} target="_blank" rel="noreferrer">
                    {item.path.split("/").pop()}
                  </a>
                </div>
              ))}
            </Card>
          </Col>
        </Row>
      </Show>
      {role &&
        ([UserRole.COORDINATOR, UserRole.ADMIN, UserRole.MANAGER].includes(
          role
        ) ||
          canEdit) && (
          <Card>
            <List
              dataSource={record?.reviews}
              header={`${record?.reviews.length} ${
                record?.reviews.length > 1 ? "reviews" : "review"
              }`}
              itemLayout="horizontal"
              renderItem={(props: any) => (
                <div className="group relative" key={props?.id}>
                  <Comment
                    {...props}
                    className="bg-transparent"
                    author={props?.reviewer?.full_name}
                    avatar={props?.reviewer?.avatar}
                    datetime={dayjs(props?.created_at).utc(true).fromNow()}
                  />
                  {role === UserRole.COORDINATOR && (
                    <Popover
                      content={
                        <Space direction="vertical">
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => setEditingRecord(props)}
                            style={{ width: "100%" }}
                          >
                            Edit
                          </Button>
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            danger
                            style={{ width: "100%" }}
                            onClick={() =>
                              deleteMutation(
                                { id: props?.id, resource: "reviews" },
                                { onSuccess: invalidates }
                              )
                            }
                          >
                            Delete
                          </Button>
                        </Space>
                      }
                    >
                      <Button
                        type="text"
                        icon={
                          <InfoCircleOutlined className="opacity-0 group-hover:opacity-100" />
                        }
                        shape="circle"
                        className="transition-all duration-300 max-h-0 max-w-0 group-hover:max-h-20 group-hover:max-w-20 absolute top-1/2 right-0 -translate-x-full -translate-y-1/2 overflow-hidden"
                      />
                    </Popover>
                  )}
                </div>
              )}
            />
            {role === UserRole.COORDINATOR && (
              <ReviewEditor
                key={editingRecord?.id}
                contribution_id={record?.id}
                onFinish={() => {
                  invalidates();
                  setEditingRecord(undefined);
                }}
                editingRecord={editingRecord}
              />
            )}
          </Card>
        )}
    </Space>
  );
};
