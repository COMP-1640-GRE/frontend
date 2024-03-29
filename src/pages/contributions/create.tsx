import { InboxOutlined } from "@ant-design/icons";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import { Form, Input, Select, Switch, Upload } from "antd";
import React, { useState } from "react";
import { useIdentity } from "../../hooks/useIdentity";

export const ContributionCreate: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps } = useForm({});
  const { faculty } = useIdentity();
  const [date] = useState(new Date().toISOString());

  const { selectProps: semesterSelectProps } = useSelect({
    resource: "semesters",
    optionLabel: "name",
    filters: [
      {
        field: "faculty.id",
        operator: "eq",
        value: faculty?.id,
      },
      {
        field: "start_date",
        operator: "lte",
        value: date,
      },
      {
        field: "end_date",
        operator: "gte",
        value: date,
      },
    ],
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        onFinish={(values: any) => {
          const { attachments, ...rest } = values;

          const formData = new FormData();
          Object.entries<string>(rest).forEach(([key, value]) => {
            if (!value) return;
            formData.append(key, value);
          });

          attachments.forEach((attachment: any) => {
            formData.append("attachments", attachment);
          });

          return formProps.onFinish?.(formData);
        }}
      >
        <Form.Item
          label={"Semester"}
          name={"semester_id"}
          rules={[{ required: true }]}
        >
          <Select {...semesterSelectProps} />
        </Form.Item>
        <Form.Item label={"Title"} name={"title"} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label={"Description"} name={"description"}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item label={"Anonymous"} name={"is_anonymous"}>
          <Switch />
        </Form.Item>
        <Form.Item
          label={"Attachments"}
          name={"attachments"}
          rules={[{ required: true }]}
          getValueFromEvent={(e) =>
            e.fileList?.map((file: any) => file.originFileObj)
          }
        >
          <Upload.Dragger
            multiple
            accept="image/*, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint"></p>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </Create>
  );
};
