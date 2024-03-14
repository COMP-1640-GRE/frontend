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
  CrudFilters,
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
const { RangePicker } = DatePicker;

interface IPeriod {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
}
interface IPeriodFilters {
  name: string;
  start_date: [Dayjs, Dayjs];
  end_date: [Dayjs, Dayjs];
}

export const PeriodList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps, searchFormProps, setFilters } = useTable<
    IPeriod,
    HttpError,
    IPeriodFilters
  >({
    syncWithLocation: true,
    onSearch: (params) => {
      const filters: CrudFilters = [];
      const { end_date, start_date, name } = params;

      if (name) {
        filters.push({
          field: "name",
          operator: "containss",
          value: name,
        });
      }

      if (start_date) {
        filters.push({
          field: "start_date",
          operator: "gte",
          value: start_date[0].toISOString(),
        });
        filters.push({
          field: "start_date",
          operator: "lte",
          value: start_date[1].toISOString(),
        });
      }

      if (end_date) {
        filters.push({
          field: "end_date",
          operator: "gte",
          value: end_date[0].toISOString(),
        });
        filters.push({
          field: "end_date",
          operator: "lte",
          value: end_date[1].toISOString(),
        });
      }

      return filters;
    },
  });

  return (
    <Row gutter={[16, 16]}>
      <Col lg={18} xs={24}>
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
      <Col lg={6} xs={24}>
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
