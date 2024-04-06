import { Icon } from "@ant-design/compatible";
import { CommentOutlined } from "@ant-design/icons";
import { DateField, EmailField, Show, TextField } from "@refinedev/antd";
import {
  IResourceComponentsProps,
  useCustomMutation,
  useInvalidate,
  useShow,
} from "@refinedev/core";
import {
  Avatar,
  Button,
  Card,
  Carousel,
  Col,
  Modal,
  Row,
  Space,
  Typography,
} from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommentList from "../../components/elements/CommentList";
import ContributionStatusTag from "../../components/elements/ContributionStatusTag";
import ContributionTag from "../../components/elements/ContributionTag";
import EvaluateTag from "../../components/elements/EvaluateTag";
import { REACTION_TYPE, reactionIcons } from "../../enums/reaction.enum";
import { useIdentity } from "../../hooks/useIdentity";
import { getReacted } from "../../utils/reaction";

const { Title } = Typography;

export const ContributionShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;
  const { id } = useIdentity();
  const record = data?.data;
  const canEdit = id === record?.author?.id;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { mutate } = useCustomMutation();
  const invalidate = useInvalidate();
  const invalidates = () =>
    invalidate({
      resource: "contributions",
      id: record?.id,
      invalidates: ["all"],
    });

  const reaction = record?.reaction || {};
  const reacted = getReacted(record?.reactions, id);

  return (
    <Show
      isLoading={isLoading}
      canEdit={canEdit}
      canDelete={false}
      title={""}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          {canEdit && (
            <Button
              type="primary"
              onClick={() =>
                navigate(`/management/contributions/review/${record?.id}`)
              }
            >
              View result
            </Button>
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
          <Space className="w-full">
            {REACTION_TYPE.map((item) => {
              return (
                <Button
                  type="text"
                  size="large"
                  icon={
                    <Icon
                      type={reactionIcons[item]}
                      theme={reacted === item ? "filled" : "outlined"}
                    />
                  }
                  key={item}
                  onClick={() =>
                    mutate(
                      {
                        method: "post",
                        url: `contributions/${record?.id}/reaction`,
                        values: { type: item },
                        successNotification: {
                          message: "Reacted",
                          type: "success",
                        },
                      },
                      {
                        onSuccess: invalidates,
                      }
                    )
                  }
                >
                  {" "}
                  {reaction[item]}
                </Button>
              );
            })}
            <Button
              type="text"
              size="large"
              icon={<CommentOutlined />}
              onClick={() => setOpen(true)}
            >
              {" "}
              {record?.comment_count}
            </Button>
          </Space>
        </div>
        {record?.author ? (
          <div className="flex flex-row items-center gap-4">
            <Avatar src={record?.author?.avatar} size={84} shape="square" />
            <div>
              <p>{record?.author?.faculty?.name}</p>
              <Title level={4}>
                {record?.author.first_name} {record?.author.last_name}
              </Title>
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
      <Modal
        centered
        open={open}
        closable
        onCancel={() => setOpen(false)}
        footer={null}
        width={"90%"}
      >
        <CommentList
          contribution_id={open ? record?.id : undefined}
          id={id}
          mutate={mutate}
        />
      </Modal>
    </Show>
  );
};
