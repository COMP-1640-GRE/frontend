import { SearchOutlined, ShareAltOutlined } from "@ant-design/icons";
import { List, useSelect, useTable } from "@refinedev/antd";
import {
  CrudFilters,
  IResourceComponentsProps,
  useCustomMutation,
  useInvalidate,
  useNotification,
} from "@refinedev/core";
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  Pagination,
  Row,
  Select,
} from "antd";
import { truncate } from "lodash";
import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useNavigate } from "react-router-dom";
import {
  REACTION_TYPE,
  reactionActiveIcons,
  reactionInactiveIcons,
} from "../../enums/reaction.enum";
import { UserRole } from "../../enums/user.enum";
import { useIdentity } from "../../hooks/useIdentity";
import { applyFilters } from "../../utils/filters";

export const ContributionGallery: React.FC<IResourceComponentsProps> = () => {
  const { role, faculty } = useIdentity();
  const [date] = useState(new Date().toISOString());
  const {
    tableProps,
    searchFormProps,
    sorters,
    setFilters,
    setSorters,
    setCurrent,
    setPageSize,
  } = useTable({
    syncWithLocation: true,
    filters: {
      permanent: (
        [
          {
            field: "status",
            operator: "eq",
            value: "approved",
          },
          {
            field: "semester.end_date",
            operator: "gte",
            value: date,
          },
        ] as CrudFilters
      ).concat(
        [UserRole.GUEST].includes(role as UserRole)
          ? [
              {
                field: "semester.faculty.id",
                operator: "eq",
                value: faculty?.id,
              },
            ]
          : []
      ),
    },
    onSearch: (params: any) =>
      applyFilters(params, {
        contains: ["title"],
      }),
  });

  const { selectProps: facultySelectProps } = useSelect({
    resource: "faculties",
    optionLabel: "name",
  });

  const { selectProps: semesterSelectProps } = useSelect({
    resource: "semesters",
    optionLabel: "name",
  });
  const { open } = useNotification();
  const { mutate } = useCustomMutation();
  const invalidate = useInvalidate();
  const navigate = useNavigate();
  const invalidates = () =>
    invalidate({
      resource: "contributions",
      invalidates: ["all"],
    });

  const [order, setOrder] = React.useState<"asc" | "desc">("asc");

  return (
    <Row gutter={[16, 16]} className="max-md:flex-col-reverse">
      <Col xs={24} md={18}>
        <List title="Contributions">
          <Row gutter={[8, 8]}>
            {tableProps.dataSource?.map((item) => {
              const author = item.author;
              const attachments = item["attachments"];
              let image = "";

              if (Array.isArray(attachments)) {
                image = attachments.find(
                  (attachment) => attachment.type === "image"
                )?.path;
              }
              const { reacted, ...reaction } = item.reaction;

              return (
                <Col xs={24} md={12} xl={8} xxl={6} key={item.id}>
                  <Card
                    cover={
                      <Image
                        preview={false}
                        src={image || "https://placehold.co/400?text=No+Image"}
                        className="aspect-square object-contain cursor-pointer"
                        onClick={() => navigate(`${item.id}`)}
                      />
                    }
                    actions={[
                      ...REACTION_TYPE.map((reactionType) => {
                        const Icon = (
                          reacted === reactionType
                            ? reactionActiveIcons
                            : reactionInactiveIcons
                        )[reactionType];
                        return (
                          <span
                            key={reactionType}
                            onClick={(e) => {
                              e.stopPropagation();
                              mutate(
                                {
                                  method: "post",
                                  url: `contributions/${item.id}/reaction`,
                                  values: { type: reactionType },
                                  successNotification: {
                                    message: "Reacted",
                                    type: "success",
                                  },
                                },
                                {
                                  onSuccess: invalidates,
                                }
                              );
                            }}
                          >
                            <Icon /> {reaction[reactionType]}
                          </span>
                        );
                      }),
                      <CopyToClipboard
                        text={window.location.href}
                        onCopy={() => {
                          open?.({ message: "Link Copied", type: "success" });
                        }}
                      >
                        <ShareAltOutlined
                          key="share"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </CopyToClipboard>,
                    ]}
                  >
                    <Card.Meta
                      avatar={<Avatar src={author.avatar} />}
                      title={item["title"]}
                      description={
                        <>
                          By {author.full_name}
                          <br />
                          {truncate(item["description"])}
                        </>
                      }
                    />
                  </Card>
                </Col>
              );
            })}
          </Row>
          <div>
            <Pagination
              {...tableProps.pagination}
              showSizeChanger
              className="mt-4"
              onChange={(page) => setCurrent(page)}
              onShowSizeChange={(_, pageSize) => setPageSize(pageSize)}
            />
          </div>
        </List>
      </Col>
      <Col xs={24} md={6} className="space-y-4">
        <Card>
          <Form layout="vertical" {...searchFormProps}>
            <Form.Item label="Search" name="title">
              <Input placeholder="title" prefix={<SearchOutlined />} />
            </Form.Item>
            <Form.Item label={"Faculty"} name={["semester.faculty.id"]}>
              <Select {...facultySelectProps} />
            </Form.Item>
            <Form.Item label={"Semester"} name={"semester.id"}>
              <Select {...semesterSelectProps} />
            </Form.Item>
            <Form.Item>
              <Row
                gutter={16}
                justify="space-between"
                align="middle"
                style={{ marginTop: "10px" }}
              >
                <Button htmlType="submit" type="primary">
                  Filter
                </Button>
                <Button
                  onClick={() => {
                    setFilters(() => []);
                    searchFormProps.form?.resetFields();
                  }}
                  type="default"
                >
                  Reset
                </Button>
              </Row>
            </Form.Item>
          </Form>
        </Card>
        <Card>
          <Form>
            <Form.Item>
              <Select
                allowClear
                className="w-full"
                options={SORTABLE}
                onChange={(value) =>
                  setSorters(value ? [{ field: value, order }] : [])
                }
              />
            </Form.Item>
            <Form.Item>
              <Select
                className="w-full"
                options={[
                  {
                    value: "asc",
                    label: "Ascending",
                  },
                  {
                    value: "desc",
                    label: "Descending",
                  },
                ]}
                value={order}
                onChange={(value) => {
                  setOrder(value);
                  setSorters(sorters.map((s) => ({ ...s, order: value })));
                }}
              />
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

const SORTABLE = [
  {
    value: "id",
    label: "ID",
  },
  {
    value: "like",
    label: "Like",
  },
  {
    value: "dislike",
    label: "Dislike",
  },
  {
    value: "created_at",
    label: "Date",
  },
  {
    value: "comment_count",
    label: "Total comments",
  },
];
