import { SearchOutlined } from "@ant-design/icons";
import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  TextField,
  useTable,
} from "@refinedev/antd";
import {
  BaseRecord,
  HttpError,
  IResourceComponentsProps,
} from "@refinedev/core";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Space,
  Table,
} from "antd";
import { Dayjs } from "dayjs";
import React from "react";
import { applyFilters } from "../../utils/filters";
const { RangePicker } = DatePicker;

interface ISemester {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  due_date: string;
}
interface ISemesterFilters {
  name: string;
  start_date: [Dayjs, Dayjs];
  end_date: [Dayjs, Dayjs];
  due_date: [Dayjs, Dayjs];
}

export const SemesterList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps, searchFormProps, setFilters } = useTable<
    ISemester,
    HttpError,
    ISemesterFilters
  >({
    syncWithLocation: true,
    onSearch: (params) =>
      applyFilters(params, {
        contains: ["name"],
        gte: ["start_date", "end_date", "due_date"],
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
              dataIndex="description"
              title={"Description"}
              sorter
            />
            <Table.Column
              dataIndex="start_date"
              title={"Start Date"}
              render={(value) => <DateField value={value} />}
              sorter
            />
            <Table.Column
              dataIndex="end_date"
              title={"End Date"}
              render={(value) => <DateField value={value} />}
              sorter
            />
            <Table.Column
              dataIndex="due_date"
              title={"Due Date"}
              render={(value) => <DateField value={value} />}
              sorter
            />
            <Table.Column
              dataIndex="faculty"
              title={"Faculty"}
              render={(value) => <TextField value={value?.name} />}
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
            <Form.Item label="Start Date" name="start_date">
              <RangePicker />
            </Form.Item>
            <Form.Item label="End Date" name="end_date">
              <RangePicker />
            </Form.Item>
            <Form.Item label="Due Date" name="due_date">
              <RangePicker />
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
