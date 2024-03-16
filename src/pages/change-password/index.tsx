import { ThemedTitleV2 } from "@refinedev/antd";
import { useNotification, useTranslate } from "@refinedev/core";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Layout,
  Row,
  Typography,
  theme,
} from "antd";
import { CSSProperties } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import api from "../../services/apis";

type ChangePasswordForm = {
  password: string;
  new_password: string;
  confirm_password: string;
};

export const ChangePassword = () => {
  const { token } = theme.useToken();
  const [form] = Form.useForm<ChangePasswordForm>();
  const translate = useTranslate();
  const navigate = useNavigate();
  const { open } = useNotification();

  const { mutate: login, isLoading } = useMutation({
    mutationFn: async ({
      password,
      new_password,
      confirm_password,
    }: ChangePasswordForm) => {
      if (new_password !== confirm_password) {
        return open?.({
          message: "Error",
          type: "error",
          description: "Passwords do not match",
          undoableTimeout: 3000,
        });
      }

      const res = await api.patch("/users/change-password", {
        password,
        new_password,
      });

      if (res) {
        open?.({
          message: "Success",
          type: "success",
          description: "Password changed successfully",
          undoableTimeout: 3000,
        });
        navigate("/");
      }
    },
  });

  const PageTitle = (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "32px",
        fontSize: "20px",
      }}
    >
      {<ThemedTitleV2 collapsed={false} />}
    </div>
  );

  const CardTitle = (
    <Typography.Title
      level={3}
      style={{
        color: token.colorPrimaryTextHover,
        ...titleStyles,
      }}
    >
      {translate("pages.changePassword.title", "Change Password")}
    </Typography.Title>
  );

  const CardContent = (
    <Card
      title={CardTitle}
      headStyle={headStyles}
      bodyStyle={bodyStyles}
      style={{
        ...containerStyles,
        backgroundColor: token.colorBgElevated,
      }}
    >
      <Form<ChangePasswordForm>
        layout="vertical"
        form={form}
        onFinish={(values) => login(values)}
        requiredMark={false}
        initialValues={{
          remember: false,
        }}
      >
        <Form.Item
          name="password"
          label={translate("pages.activate.fields.password", "Password")}
          rules={[{ required: true }]}
        >
          <Input
            type="password"
            autoComplete="current-password"
            placeholder="●●●●●●●●"
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="new_password"
          label={translate(
            "pages.activate.fields.new_password",
            "New password"
          )}
          rules={[{ required: true }]}
        >
          <Input
            type="password"
            autoComplete="current-password"
            placeholder="●●●●●●●●"
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="confirm_password"
          label={translate(
            "pages.activate.fields.confirm_password",
            "Confirm password"
          )}
          rules={[{ required: true }]}
        >
          <Input
            type="password"
            autoComplete="current-password"
            placeholder="●●●●●●●●"
            size="large"
          />
        </Form.Item>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        ></div>

        <Form.Item>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={isLoading}
            block
          >
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  return (
    <Layout style={layoutStyles}>
      <Row
        justify="center"
        align={"middle"}
        style={{
          padding: "16px 0",
          minHeight: "100dvh",
          paddingTop: "16px",
        }}
      >
        <Col xs={22}>
          {PageTitle}
          {CardContent}
        </Col>
      </Row>
    </Layout>
  );
};

const layoutStyles: CSSProperties = {};

const containerStyles: CSSProperties = {
  maxWidth: "400px",
  margin: "auto",
  padding: "32px",
  boxShadow:
    "0px 2px 4px rgba(0, 0, 0, 0.02), 0px 1px 6px -1px rgba(0, 0, 0, 0.02), 0px 1px 2px rgba(0, 0, 0, 0.03)",
};

const headStyles: CSSProperties = {
  borderBottom: 0,
  padding: 0,
};

const bodyStyles: CSSProperties = { padding: 0, marginTop: "32px" };

const titleStyles: CSSProperties = {
  textAlign: "center",
  marginBottom: 0,
  fontSize: "24px",
  lineHeight: "32px",
  fontWeight: 700,
  overflowWrap: "break-word",
  hyphens: "manual",
  textOverflow: "unset",
  whiteSpace: "pre-wrap",
};
