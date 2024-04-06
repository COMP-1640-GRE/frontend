import { SaveButton, useForm } from "@refinedev/antd";
import { Card, Form, Input, Switch, Typography } from "antd";
import { capitalize } from "lodash";

const SystemConfigs = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "systems/config",
    redirect: false,
    action: "edit",
    id: "",
  });

  return (
    <>
      <Typography.Title level={3}>System Configs:</Typography.Title>
      <Card className="flex flex-col gap-4">
        <Form {...formProps}>
          <Configs rootPath="" obj={formProps?.initialValues} />
          <Form.Item className="flex justify-end">
            <SaveButton {...saveButtonProps} />
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default SystemConfigs;

interface IProps {
  rootPath?: string;
  obj?: any;
}
const Configs = ({ rootPath, obj }: IProps) => {
  if (Array.isArray(obj)) {
    // TODO
    return <></>;
  }

  if (!obj || typeof obj !== "object") return <></>;
  return (
    <>
      {Object.keys(obj).map((key, index) => {
        const type = typeof obj[key];
        let item = null;
        const name = rootPath ? `${rootPath}.${key}` : key;
        switch (type) {
          case "string":
            item = <Input />;
            break;
          case "number":
            item = <Input type="number" />;
            break;
          case "boolean":
            item = <Switch />;
            break;
        }
        return (
          <>
            <Form.Item
              label={capitalize(key.replaceAll("_", " "))}
              name={name.split(".")}
              rules={[{ required: true }]}
              key={index}
            >
              {item}
            </Form.Item>
            <div className="pl-4">
              <Configs rootPath={name} obj={obj[key]} />
            </div>
          </>
        );
      })}
    </>
  );
};
