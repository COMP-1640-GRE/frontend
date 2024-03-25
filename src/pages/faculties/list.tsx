import { SearchOutlined } from "@ant-design/icons";
import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { BaseRecord, IResourceComponentsProps } from "@refinedev/core";
import { Button, Card, Col, Form, Input, Row, Space, Table } from "antd";
import React from "react";
import { applyFilters } from "../../utils/filters";

export const FacultyList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps, searchFormProps, setFilters } = useTable({
    syncWithLocation: true,
    onSearch: (params: any) =>
      applyFilters(params, {
        contains: ["name"],
      }),
  });

  return (
    <Row gutter={[16, 16]} className="max-md:flex-col-reverse">
      <Col md={18} xs={24}>
        <List>
          <Table {...tableProps} rowKey="id">
            <Table.Column dataIndex="id" title={"ID"} sorter />
            <Table.Column dataIndex="name" title={"Name"} sorter />
            <Table.Column
              dataIndex="created_at"
              title={"Create Date"}
              render={(value) => <DateField value={value} />}
              sorter
            />
            <Table.Column
              title={"Actions"}
              dataIndex="actions"
              render={(_, record: BaseRecord) => (
                <Space>
                  <EditButton hideText size="small" recordItemId={record.id} />
                  <ShowButton hideText size="small" recordItemId={record.id} />
                  <DeleteButton
                    hideText
                    size="small"
                    recordItemId={record.id}
                  />
                </Space>
              )}
            />
          </Table>
        </List>
      </Col>
      <Col md={6} xs={24}>
        <Card>
          <Form layout="vertical" {...searchFormProps}>
            <Form.Item label="Search" name="name">
              <Input placeholder="Name" prefix={<SearchOutlined />} />
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
