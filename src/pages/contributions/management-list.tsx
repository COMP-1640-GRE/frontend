import { SearchOutlined } from "@ant-design/icons";
import {
  DateField,
  DeleteButton,
  List,
  useSelect,
  useTable,
} from "@refinedev/antd";
import {
  BaseRecord,
  IResourceComponentsProps,
  useCustomMutation,
  useInvalidate,
  useNotification,
} from "@refinedev/core";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import React from "react";
import ContributionStatusTag from "../../components/elements/ContributionStatusTag";
import EvaluateTag from "../../components/elements/EvaluateTag";
import { UserRole } from "../../enums/user.enum";
import { useIdentity } from "../../hooks/useIdentity";
import { applyFilters } from "../../utils/filters";

export const ContributionManagementList: React.FC<
  IResourceComponentsProps
> = () => {
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);

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

  const { role } = useIdentity();
  const { mutate, isLoading } = useCustomMutation();
  const invalidates = useInvalidate();

  return (
    <Row gutter={[16, 16]} className="max-md:flex-col-reverse">
      <Col md={18} xs={24}>
        <List>
          <Table
            {...tableProps}
            pagination={{
              ...tableProps.pagination,
              pageSizeOptions: [5, 10, 20, 50, 100],
              showSizeChanger: true,
            }}
            rowKey="id"
            rowSelection={
              role === UserRole.FACULTY_MARKETING_COORDINATOR ||
              role === UserRole.UNIVERSITY_MARKETING_MANAGER
                ? {
                    onChange: (selectedRowKeys) =>
                      setSelectedRowKeys(selectedRowKeys),
                  }
                : undefined
            }
          >
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
      <Col md={6} xs={24} className="space-y-4">
        {(role === UserRole.FACULTY_MARKETING_COORDINATOR ||
          role === UserRole.UNIVERSITY_MARKETING_MANAGER) && (
          <Button
            type="primary"
            loading={isLoading}
            onClick={() =>
              mutate(
                {
                  method: "patch",
                  url: `/contributions/${
                    role === UserRole.FACULTY_MARKETING_COORDINATOR
                      ? "select-multiple"
                      : "approve-multiple"
                  }`,
                  values: { ids: selectedRowKeys },
                },
                {
                  onSuccess: () => {
                    open?.({ message: "Success", type: "success" });
                    invalidates({
                      invalidates: ["list"],
                      resource: "contributions",
                    });
                  },
                }
              )
            }
          >
            {role === UserRole.FACULTY_MARKETING_COORDINATOR
              ? "Selects"
              : "Approves"}
          </Button>
        )}
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
