import {
  DislikeOutlined,
  LikeOutlined,
  SearchOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { List, useSelect, useTable } from "@refinedev/antd";
import { IResourceComponentsProps, useNotification } from "@refinedev/core";
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Pagination,
  Row,
  Select,
} from "antd";
import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useNavigate } from "react-router-dom";
import { applyFilters } from "../../utils/filters";

export const ContributionGallery: React.FC<IResourceComponentsProps> = () => {
  const { tableProps, searchFormProps, setFilters } = useTable({
    syncWithLocation: true,
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
  // const { role } = useIdentity();
  // const { mutate, isLoading } = useCustomMutation();
  // const invalidates = useInvalidate();
  const navigate = useNavigate();
  return (
    <Row gutter={[16, 16]} className="max-md:flex-col-reverse">
      <Col xs={24} md={18}>
        <List title="Contributions">
          <Row gutter={[8, 8]}>
            {tableProps.dataSource?.map((item) => (
              <Col xs={24} md={12} xl={8} xxl={6} key={item.id}>
                <Card
                  onClick={() => navigate(`${item.id}`)}
                  className="cursor-pointer"
                  cover={
                    <img
                      alt="example"
                      src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                  }
                  actions={[
                    <LikeOutlined key="like" />,
                    <DislikeOutlined key="dislike" />,

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
                    avatar={
                      <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
                    }
                    title={item["title"]}
                    description={
                      <>
                        By {item["student"].first_name}{" "}
                        {item["student"].last_name}
                        <br />
                        {item["description"]}
                      </>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
          <div>
            <Pagination
              {...tableProps.pagination}
              showSizeChanger
              className="mt-4"
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
      </Col>
    </Row>
  );
};
