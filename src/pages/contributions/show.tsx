import { DateField, EmailField, Show, TextField } from "@refinedev/antd";
import { IResourceComponentsProps, useShow } from "@refinedev/core";
import { Avatar, Card, Carousel, Col, Row, Typography } from "antd";
import React from "react";
import EvaluateTag from "../../components/elements/EvaluateTag";
import { useIdentity } from "../../hooks/useIdentity";
import ContributionStatusTag from "../../components/elements/ContributionStatusTag";
import ContributionTag from "../../components/elements/ContributionTag";

const { Title } = Typography;

export const ContributionShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;
  const { id } = useIdentity();
  const record = data?.data;

  return (
    <Show
      isLoading={isLoading}
      canEdit={id === record?.student?.id}
      canDelete={false}
      title={""}
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
        {record?.student ? (
          <div className="flex flex-row items-center gap-4">
            <Avatar src={record?.student?.avatar} size={84} shape="square" />
            <div>
              <p>{record?.student?.faculty?.name}</p>
              <Title level={4}>
                {record?.student.first_name} {record?.student.last_name}
              </Title>
              <EmailField value={record?.student?.email} />
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
  );
};
