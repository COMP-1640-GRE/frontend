import { Edit, useForm, useSelect } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import React from "react";
import dayjs from "../../libs/dayjs";

export const SemesterEdit: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps } = useForm({});

  const { selectProps: facultyQueryResult } = useSelect({
    resource: "faculties",
    optionLabel: "name",
  });

  const initialValues = formProps?.initialValues;
  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        initialValues={{
          ...initialValues,
          start_date: dayjs(initialValues?.start_date),
          end_date: dayjs(initialValues?.end_date),
          due_date: dayjs(initialValues?.due_date),
        }}
      >
        <Form.Item label={"Name"} name={["name"]} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label={"Description"} name={["description"]}>
          <Input multiple />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12} md={6}>
            <Form.Item
              label={"Faculty"}
              name={["faculty_id"]}
              rules={[{ required: true }]}
            >
              <Select
                {...facultyQueryResult}
                defaultValue={initialValues?.faculty.id}
              />
            </Form.Item>
          </Col>
          <Col span={12} md={6}>
            <Form.Item
              label={"Start Date"}
              name={["start_date"]}
              rules={[{ required: true }]}
              className="w-full"
            >
              <DatePicker showTime style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12} md={6}>
            <Form.Item
              label={"End Date"}
              name={["end_date"]}
              rules={[{ required: true }]}
            >
              <DatePicker showTime style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12} md={6}>
            <Form.Item
              label={"Due Date"}
              name={["due_date"]}
              rules={[{ required: true }]}
            >
              <DatePicker showTime style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Edit>
  );
};
