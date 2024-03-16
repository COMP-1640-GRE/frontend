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
import { LocalStorageKey } from "../../enums/local-storage.enum";
import api from "../../services/apis";

type UpdateForm = {
  email: string;
  first_name: string;
  last_name: string;
};

export const UpdateProfile = () => {
  const { token } = theme.useToken();
  const [form] = Form.useForm<UpdateForm>();
  const translate = useTranslate();
  const navigate = useNavigate();
  const { open } = useNotification();

  const { mutate: login, isLoading } = useMutation({
    mutationFn: async (args: UpdateForm) => {
      const remember = localStorage.getItem(LocalStorageKey.REMEMBER);
      if (remember) {
        localStorage.removeItem(LocalStorageKey.REMEMBER);
      }

      const res = await api.patch("/users", args);

      if (res) {
        open?.({
          message: "Success",
          type: "success",
          description: "Profile updated successfully",
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
      {translate("pages.activate.title", "Update your information")}
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
      <Form<UpdateForm>
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
            {translate("pages.activate.signin", "Update")}
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
