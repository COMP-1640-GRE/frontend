import { SaveButton, useForm } from "@refinedev/antd";
import { BaseKey, BaseRecord } from "@refinedev/core";
import { Button, Form, Input, Space } from "antd";

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
  console.log(contribution_id);

  return (
    <Form {...formProps} layout="vertical">
      <Form.Item
        name="contribution_id"
        initialValue={contribution_id}
        hidden
        key={contribution_id}
      >
        <Input value={contribution_id} />
      </Form.Item>
      <Form.Item name="content" initialValue={editingRecord?.content}>
        <Input.TextArea />
      </Form.Item>
      <Space>
        <SaveButton {...saveButtonProps}>
          {editingRecord?.id ? "Update review" : "Add review"}
        </SaveButton>
        {editingRecord?.id && <Button onClick={onFinish}>Cancel</Button>}
      </Space>
    </Form>
  );
};

export default ReviewEditor;
