import { Create, useForm, useSelect } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import { Form, Input, Select } from "antd";
import React from "react";
import RoleTag from "../../components/elements/RoleTag";
import { UserRole } from "../../enums/user.enum";

export const UserCreate: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps } = useForm({});
  const { selectProps: facultyQueryResult } = useSelect({
    resource: "faculties",
    optionLabel: "name",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Usernames"}
          name={["usernames"]}
          rules={[{ required: true }]}
        >
          <Input.TextArea
            allowClear
            placeholder="Enter usernames, separated by comma"
          />
        </Form.Item>
        <Form.Item label={"Role"} name={["role"]} rules={[{ required: true }]}>
          <Select
            maxCount={1}
            options={Object.values(UserRole).map((value) => ({
              value,
              label: <RoleTag role={value} />,
            }))}
          />
        </Form.Item>
        <Form.Item label={"faculty"} name={["faculty_id"]}>
          <Select {...facultyQueryResult} />
        </Form.Item>
      </Form>
    </Create>
  );
};
