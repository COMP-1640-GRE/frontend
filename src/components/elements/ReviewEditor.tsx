import { SaveButton, useForm } from "@refinedev/antd";
import { BaseKey } from "@refinedev/core";
import { Form, Input } from "antd";

interface IProps {
  contribution_id?: BaseKey;
  onFinish: () => void;
}

const ReviewEditor = ({ contribution_id, onFinish }: IProps) => {
  const { formProps, saveButtonProps, form } = useForm({
    resource: "reviews",
    redirect: false,
    onMutationSuccess: () => {
      onFinish();
      form.resetFields();
    },
  });

  return (
    <Form {...formProps} layout="vertical">
      <Form.Item name="contribution_id" initialValue={contribution_id} hidden />
      <Form.Item name="content">
        <Input.TextArea />
      </Form.Item>
      <SaveButton {...saveButtonProps}>Add review</SaveButton>
    </Form>
  );
};

export default ReviewEditor;
