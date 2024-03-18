import { SearchOutlined } from "@ant-design/icons";
import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  useTable,
} from "@refinedev/antd";
import {
  BaseRecord,
  CrudFilters,
  IResourceComponentsProps,
} from "@refinedev/core";
import { Button, Card, Col, Form, Input, Row, Space, Table } from "antd";
import React from "react";
import AccountStatusTag from "../../components/elements/AccountStatusTag";
import RoleTag from "../../components/elements/RoleTag";

export const UserList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps, searchFormProps, setFilters } = useTable({
    syncWithLocation: true,
    onSearch: (params: any) => {
      const filters: CrudFilters = [];
      const { username } = params;

      if (username) {
        filters.push({
          field: "username",
          operator: "contains",
          value: username,
        });
      }

      return filters;
    },
  });

  return (
    <Row gutter={[16, 16]} className="max-md:flex-col-reverse">
      <Col md={18} xs={24}>
        <List>
          <Table {...tableProps} rowKey="id">
            <Table.Column dataIndex="id" title="ID" sorter />
            <Table.Column
              dataIndex="role"
              title="Role"
              sorter
              render={(value) => <RoleTag role={value} />}
            />
            <Table.Column dataIndex="username" title="Username" sorter />
            <Table.Column
              dataIndex="account_status"
              title="Status"
              sorter
              render={(value) => <AccountStatusTag status={value} />}
            />
            <Table.Column dataIndex="first_name" title="First name" sorter />
            <Table.Column dataIndex="last_name" title="Last name" sorter />
            <Table.Column dataIndex="email" title="Email" sorter />
            <Table.Column
              dataIndex="created_at"
              title="Create Date"
              render={(value) => <DateField value={value} />}
              sorter
            />
            <Table.Column
              title="Actions"
              dataIndex="actions"
              render={(_, record: BaseRecord) => (
                <Space>
                  <EditButton hideText size="small" recordItemId={record.id} />
                  {/* TODO: Add Show */}
                  {/* <ShowButton hideText size="small" recordItemId={record.id} /> */}
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
            <Form.Item label="Search" name="username">
              <Input placeholder="Username" prefix={<SearchOutlined />} />
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
