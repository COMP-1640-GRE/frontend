import { LockOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  DeleteButton,
  Edit,
  SaveButton,
  useForm,
  useSelect,
} from "@refinedev/antd";
import { IResourceComponentsProps, useNotification } from "@refinedev/core";
import { Button, Col, Form, Input, Row, Select } from "antd";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import RoleTag from "../../components/elements/RoleTag";
import { UserRole } from "../../enums/user.enum";
import api from "../../services/apis";

export const UserEdit: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps, formLoading, id } = useForm({});
  const { selectProps: facultyQueryResult } = useSelect({
    resource: "faculties",
    optionLabel: "name",
  });
  const { open } = useNotification();
  const { mutateAsync: mutateLockAccount } = useMutation({
    mutationFn: async (id: number) => {
      try {
        const res = await api.patch(`/users/${id}/lock`);
        let description = "User unlocked successfully";
        if (res?.data["account_status"] === "locked") {
          description = "User locked successfully";
        }
        return open?.({
          message: "Success",
          type: "success",
          description,
          undoableTimeout: 3000,
        });
      } catch (error) {
        return open?.({
          message: "Error",
          type: "error",
          description: "Failed to lock user",
          undoableTimeout: 3000,
        });
      }
    },
  });
  const { mutateAsync: mutateResetPassword } = useMutation({
    mutationFn: async (id: number) => {
      try {
        const res = await api.patch(`/users/${id}/reset-password`);
        let description = "Reset password successfully";
        if (res?.data["account_status"] === "locked") {
          description = "User locked successfully";
        }
        return open?.({
          message: "Success",
          type: "success",
          description,
          undoableTimeout: 3000,
        });
      } catch (error) {
        return open?.({
          message: "Error",
          type: "error",
          description: "Failed to reset password",
          undoableTimeout: 3000,
        });
      }
    },
  });

  return (
    <Edit
      saveButtonProps={saveButtonProps}
      isLoading={formLoading}
      footerButtons={[
        <SaveButton />,
        <DeleteButton />,
        <Button
          icon={<LockOutlined />}
          onClick={() => id && mutateLockAccount(+id)}
        >
          Lock
        </Button>,
        <Button
          icon={<ReloadOutlined />}
          onClick={() => id && mutateResetPassword(+id)}
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
