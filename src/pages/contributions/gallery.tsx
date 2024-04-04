import {
  DislikeFilled,
  DislikeOutlined,
  LikeFilled,
  LikeOutlined,
  SearchOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { List, useSelect, useTable } from "@refinedev/antd";
import {
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
import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useNavigate } from "react-router-dom";
import { applyFilters } from "../../utils/filters";

export const ContributionGallery: React.FC<IResourceComponentsProps> = () => {
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
      permanent: [
        {
          field: "status",
          operator: "eq",
          value: "approved",
        },
      ],
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
              const student = item["student"];
              const attachments = item["attachments"];
              let image = "";

              if (Array.isArray(attachments)) {
                image = attachments.find(
                  (attachment) => attachment.type === "image"
                )?.path;
              }
              const { like, dislike, reacted } = item.reaction;

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
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          mutate(
                            {
                              method: "post",
                              url: `contributions/${item.id}/reaction`,
                              values: { type: "like" },
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
                        {like}{" "}
                        {reacted === "like" ? (
                          <LikeFilled key="like" />
                        ) : (
                          <LikeOutlined key="like" />
                        )}
                      </span>,
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          mutate(
                            {
                              method: "post",
                              url: `contributions/${item.id}/reaction`,
                              values: { type: "dislike" },
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
                        {dislike}{" "}
                        {reacted === "dislike" ? (
                          <DislikeFilled key="dislike" />
                        ) : (
                          <DislikeOutlined key="dislike" />
                        )}
                      </span>,

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
                      avatar={<Avatar src={student.avatar} />}
                      title={item["title"]}
                      description={
                        <>
                          By {student.first_name} {student.last_name}
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
];
