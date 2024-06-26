import { PlusOutlined } from "@ant-design/icons";
import { ThemedTitleV2 } from "@refinedev/antd";
import { useCustomMutation, useTranslate } from "@refinedev/core";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Layout,
  Row,
  Typography,
  Upload,
  theme,
} from "antd";
import { UploadFileStatus } from "antd/lib/upload/interface";
import { CSSProperties, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../services/apis";

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

  const [uploadStatus, setUploadStatus] = useState<UploadFileStatus>();

  const { mutate, isLoading } = useCustomMutation();

  const update = (values: UpdateForm) =>
    mutate(
      { method: "patch", url: "/users", values },
      { onSuccess: () => navigate("/") }
    );

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
          <Card
            title={CardTitle}
            headStyle={headStyles}
            bodyStyle={bodyStyles}
            style={{
              ...containerStyles,
              backgroundColor: token.colorBgElevated,
            }}
          >
            <Upload.Dragger
              listType="picture-circle"
              action={`${baseURL}/users/avatar`}
              withCredentials
              maxCount={1}
              onChange={({ file }) => setUploadStatus(file.status)}
              disabled={uploadStatus === "done"}
            >
              <button style={{ border: 0, background: "none" }} type="button">
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload Avatar</div>
              </button>
            </Upload.Dragger>
            <Form<UpdateForm>
              layout="vertical"
              form={form}
              onFinish={(values) => update(values)}
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
                    label={translate(
                      "pages.activate.fields.last_name",
                      "Last name"
                    )}
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
                  placeholder={translate(
                    "pages.activate.fields.email",
                    "Email"
                  )}
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
