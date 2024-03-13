import { ThemedTitleV2 } from "@refinedev/antd";
import { useGetIdentity, useNotification, useTranslate } from "@refinedev/core";
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
import { LocalStorageKey } from "../../enums/local-storage.enum";
import api from "../../services/apis";
import { Identity } from "../../services/types";

type ActivateForm = {
  username: string;
  password: string;
  new_password: string;
  confirm_password: string;
  email: string;
  first_name: string;
  last_name: string;
};

export const ActivateAccount = () => {
  const { token } = theme.useToken();
  const [form] = Form.useForm<ActivateForm>();
  const translate = useTranslate();
  const navigate = useNavigate();
  const { open } = useNotification();
  const { data: identity } = useGetIdentity<Identity>();

  const { mutate: login, isLoading } = useMutation({
    mutationFn: async (args: ActivateForm) => {
      if (args.new_password !== args.confirm_password) {
        return open?.({
          message: "Error",
          type: "error",
          description: "Passwords do not match",
          undoableTimeout: 3000,
        });
      }

      const remember = localStorage.getItem(LocalStorageKey.REMEMBER);
      if (remember) {
        localStorage.removeItem(LocalStorageKey.REMEMBER);
      }

      const res = await api.patch("/auth/activate-account", {
        ...args,
        username: identity?.username,
        remember: !!remember,
      });

      if (res) {
        localStorage.setItem(LocalStorageKey.USER, JSON.stringify(res.data));
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
      {translate("pages.activate.title", "Activate your account")}
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
      <Form<ActivateForm>
        layout="vertical"
        form={form}
        onFinish={(values) => login(values)}
        requiredMark={false}
        initialValues={{
          remember: false,
        }}
      >
        <Row gutter={[6, 6]}>
          <Col span={12}>
            <Form.Item
              name="first_name"
              label={translate(
                "pages.activate.fields.first_name",
                "First name"
              )}
              rules={[{ required: true }]}
            >
              <Input
                size="large"
                placeholder={translate(
                  "pages.activate.fields.first_name",
                  "First name"
                )}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="last_name"
              label={translate("pages.activate.fields.last_name", "Last name")}
              rules={[{ required: true }]}
            >
              <Input
                size="large"
                placeholder={translate(
                  "pages.activate.fields.last_name",
                  "Last name"
                )}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
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
            {translate("pages.activate.signin", "Activate")}
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
