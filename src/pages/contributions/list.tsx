import { SearchOutlined } from "@ant-design/icons";
import { DateField, DeleteButton, List, useTable } from "@refinedev/antd";
import {
  BaseRecord,
  CrudFilters,
  IResourceComponentsProps,
} from "@refinedev/core";
import { Button, Card, Col, Form, Input, Row, Space, Table } from "antd";
import React from "react";
import ContributionStatusTag from "../../components/elements/ContributionStatusTag";
import EvaluateTag from "../../components/elements/EvaluateTag";

export const ContributionList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps, searchFormProps, setFilters } = useTable({
    syncWithLocation: true,
    onSearch: (params: any) => {
      const filters: CrudFilters = [];
      const { title } = params;

      if (title) {
        filters.push({
          field: "title",
          operator: "contains",
          value: title,
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
            <Table.Column dataIndex="title" title="Title" sorter />
            <Table.Column
              dataIndex="semester.name"
              title="Semester"
              sorter
              render={(_, record: BaseRecord) => record.semester.name}
            />
            <Table.Column
              dataIndex="semester.faculty.name"
              title="Faculty"
              sorter
              render={(_, record: BaseRecord) => record.semester.faculty.name}
            />
            <Table.Column
              dataIndex="student.first_name"
              title="Student"
              sorter
              render={(_, record: BaseRecord) =>
                record.student.first_name + " " + record.student.last_name
              }
            />
            <Table.Column
              dataIndex="status"
              title="Status"
              sorter
              render={(value) => <ContributionStatusTag status={value} />}
            />
            <Table.Column
              dataIndex="evaluation"
              title="Evaluation"
              sorter
              render={(value) => <EvaluateTag evaluation={value} />}
            />
            <Table.Column
              dataIndex="created_at"
              title="Create Date"
              sorter
              render={(value) => <DateField value={value} />}
            />
            <Table.Column
              title="Actions"
              dataIndex="actions"
              render={(_, record: BaseRecord) => (
                <Space>
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
