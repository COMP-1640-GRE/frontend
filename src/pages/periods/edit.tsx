import { Edit, useForm, useSelect } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import React from "react";
import dayjs from "../../libs/dayjs";

export const CategoryEdit: React.FC<IResourceComponentsProps> = () => {
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
        }}
      >
        <Form.Item label={"Name"} name={["name"]} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label={"Description"} name={["description"]}>
          <Input multiple />
        </Form.Item>
        <Row gutter={16}>
          <Col span={8}>
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
          <Col span={8}>
            <Form.Item
              label={"Start Date"}
              name={["start_date"]}
              rules={[{ required: true }]}
            >
              <DatePicker showTime />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={"End Date"}
              name={["end_date"]}
              rules={[{ required: true }]}
            >
              <DatePicker showTime />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Edit>
  );
};
