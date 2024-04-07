import { ThemedTitleV2 } from "@refinedev/antd";
import {
  useCustomMutation,
  useNotification,
  useTranslate,
} from "@refinedev/core";
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
import { CSSProperties, useState } from "react";
import { useNavigate } from "react-router-dom";

type ForgotPasswordForm = {
  code: string;
  email: string;
  new_password: string;
  confirm_password: string;
};

export const ForgotPassword = () => {
  const { token } = theme.useToken();
  const [form] = Form.useForm<ForgotPasswordForm>();
  const translate = useTranslate();
  const navigate = useNavigate();
  const { open } = useNotification();
  const { mutate, isLoading } = useCustomMutation();
  const [step, setStep] = useState<"email" | "code">("email");

  const activate = ({
    code,
    confirm_password,
    email,
    new_password,
  }: ForgotPasswordForm) => {
    console.log("llooo");

    if (step === "email") {
      return mutate(
        {
          method: "post",
          url: "/users/forgot-password",
          values: { email },
          successNotification: {
            type: "success",
            message: "Email sent successfully",
            description: "Please check your email for verification code",
          },
        },
        {
          onSuccess: () => setStep("code"),
        }
      );
    }

    if (new_password !== confirm_password) {
      return open?.({
        message: "Error",
        type: "error",
        description: "Passwords do not match",
        undoableTimeout: 3000,
      });
    }

    return mutate(
      {
        method: "post",
        url: "/users/reset-password",
        values: {
          code,
          email,
          password: new_password,
        },
        successNotification: {
          type: "success",
          message: "Password reset successfully",
          description: "Please login with your new password",
        },
      },
      {
        onSuccess: () => navigate("/"),
      }
    );
  };

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
      Forgot Password
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
      <Form<ForgotPasswordForm>
        layout="vertical"
        form={form}
        onFinish={(values) => activate(values)}
        requiredMark={false}
        initialValues={{
          remember: false,
        }}
      >
        <Form.Item
          hidden={step === "code"}
          name="email"
          label={translate("pages.activate.fields.email", "Email")}
          rules={[{ required: true }]}
        >
          <Input
            size="large"
            placeholder={translate("pages.activate.fields.email", "Email")}
          />
        </Form.Item>
        <Form.Item
          hidden={step === "email"}
          name="code"
          label={"Verification code"}
          rules={[{ required: step === "code" }]}
        >
          <Input size="large" placeholder={"Verification code"} />
        </Form.Item>
        <Form.Item
          hidden={step === "email"}
          name="new_password"
          label={translate(
            "pages.activate.fields.new_password",
            "New password"
          )}
          rules={[{ required: step === "code" }]}
        >
          <Input.Password
            hidden={step === "email"}
            type="password"
            autoComplete="current-password"
            size="large"
          />
        </Form.Item>
        <Form.Item
          hidden={step === "email"}
          name="confirm_password"
          label={translate(
            "pages.activate.fields.confirm_password",
            "Confirm password"
          )}
          rules={[{ required: step === "code" }]}
        >
          <Input.Password
            type="password"
            autoComplete="current-password"
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
            {step === "email" ? "Send verification code" : "Change password"}
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
