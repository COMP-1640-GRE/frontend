import { LockOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  DeleteButton,
  Edit,
  SaveButton,
  useForm,
  useSelect,
} from "@refinedev/antd";
import {
  IResourceComponentsProps,
  useCustomMutation,
  useNotification,
} from "@refinedev/core";
import { Button, Col, Form, Input, Row, Select } from "antd";
import React from "react";
import RoleTag from "../../components/elements/RoleTag";
import { UserRole } from "../../enums/user.enum";

export const UserEdit: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps, formLoading, id } = useForm({});
  const { selectProps: facultyQueryResult } = useSelect({
    resource: "faculties",
    optionLabel: "name",
  });
  const { open } = useNotification();
  const { mutate: mutateLockAccount } = useCustomMutation();

  const lockAccount = async (id: number) =>
    mutateLockAccount(
      {
        method: "patch",
        url: `/users/${id}/lock`,
        values: {},
      },
      {
        onSuccess: (res) => {
          let description = "User unlocked successfully";
          if (res?.data["account_status"] === "locked") {
            description = "User locked successfully";
          }

          open?.({
            message: "Success",
            type: "success",
            description,
            undoableTimeout: 3000,
          });
        },
      }
    );

  const { mutate: mutateResetPassword } = useCustomMutation();

  const resetPassword = (id: number) =>
    mutateResetPassword(
      {
        method: "patch",
        url: `/users/${id}/reset-password`,
        values: {},
      },
      {
        onSuccess: (res) => {
          let description = "Reset password successfully";
          if (res?.data["account_status"] === "locked") {
            description = "User locked successfully";
          }
          open?.({
            message: "Success",
            type: "success",
            description,
            undoableTimeout: 3000,
          });
        },
      }
    );

  return (
    <Edit
      isLoading={formLoading}
      footerButtons={[
        <SaveButton {...saveButtonProps} />,
        <DeleteButton />,
        <Button icon={<LockOutlined />} onClick={() => id && lockAccount(+id)}>
          Lock
        </Button>,
        <Button
          icon={<ReloadOutlined />}
          onClick={() => id && resetPassword(+id)}
        >
          Reset Password
        </Button>,
      ]}
    >
      <Form {...formProps} layout="vertical">
        <Row gutter={[6, 6]}>
          <Col span={12}>
            <Form.Item
              name="first_name"
              label={"First name"}
              rules={[{ required: true }]}
            >
              <Input size="large" placeholder={"First name"} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="last_name"
              label={"Last name"}
              rules={[{ required: true }]}
            >
              <Input size="large" placeholder={"Last name"} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label={"Email"}
          name={["email"]}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Username"}
          name={["username"]}
          rules={[{ required: true }]}
        >
          <Input />
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
    </Edit>
  );
};
