import { InboxOutlined } from "@ant-design/icons";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import { Form, Input, Select, Switch, Upload } from "antd";
import React, { useState } from "react";
import { useIdentity } from "../../hooks/useIdentity";

export const ContributionEdit: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps, formLoading, queryResult } = useForm({});

  const record = queryResult?.data?.data;

  const { faculty, id } = useIdentity();
  const [date] = useState(new Date().toISOString());
  const [to_delete, setToDelete] = useState<string[]>([]);
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
    <Edit
      saveButtonProps={saveButtonProps}
      isLoading={formLoading}
      canDelete={id === record?.student?.id}
    >
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

          formData.append("to_delete", JSON.stringify(to_delete));

          attachments.forEach((attachment: any) => {
            if (!attachment) return;
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
          getValueFromEvent={(e) =>
            e.fileList?.map((file: any) => file.originFileObj)
          }
        >
          <Upload.Dragger
            multiple
            accept="image/*, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            defaultFileList={
              formProps?.initialValues?.attachments?.map((file: any) => ({
                uid: file.id,
                name: file.path.split("/").pop(),
                status: "done",
                url: file.path,
              })) || []
            }
            onRemove={(file) => {
              if (file.url) {
                setToDelete((prev) => [...prev, file.url!]);
              }
            }}
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
    </Edit>
  );
};
