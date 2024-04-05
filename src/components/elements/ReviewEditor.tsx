import { SaveButton, useForm } from "@refinedev/antd";
import { BaseKey, BaseRecord } from "@refinedev/core";
import { Form, Input } from "antd";

interface IProps {
  contribution_id?: BaseKey;
  onFinish: () => void;
  editingRecord?: BaseRecord;
}

const ReviewEditor = ({ contribution_id, editingRecord, onFinish }: IProps) => {
  const { formProps, saveButtonProps, form } = useForm({
    resource: "reviews",
    redirect: false,
    action: editingRecord ? "edit" : "create",
    id: editingRecord?.id,
    onMutationSuccess: () => {
      onFinish();
      form.resetFields();
    },
  });

  return (
    <Form {...formProps} layout="vertical">
      <Form.Item name="contribution_id" initialValue={contribution_id} hidden />
      <Form.Item name="content" initialValue={editingRecord?.content}>
        <Input.TextArea />
      </Form.Item>
      <SaveButton {...saveButtonProps}>
        {editingRecord?.id ? "Update review" : "Add review"}
      </SaveButton>
    </Form>
  );
};

export default ReviewEditor;
