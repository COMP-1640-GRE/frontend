import { Comment } from "@ant-design/compatible";
import { SaveButton, TextField, useForm } from "@refinedev/antd";
import { BaseKey } from "@refinedev/core";
import { Button, Card, Checkbox, Form, Input, Space } from "antd";
import dayjs from "../../libs/dayjs";
import { CommentActivity } from "./CommentList";

interface IProps {
  contribution_id?: BaseKey;
  onFinish: () => void;
  activity?: CommentActivity;
}

const CommentEditor = ({ contribution_id, activity, onFinish }: IProps) => {
  const { formProps, saveButtonProps, form } = useForm({
    resource: "comments",
    redirect: false,
    action: activity?.type === "edit" ? "edit" : "create",
    id: activity?.comment?.id,
    onMutationSuccess: () => {
      onFinish();
      form.resetFields();
    },
  });

  return (
    <Space direction="vertical" className="w-full">
      {activity && (
        <>
          {activity?.type === "edit" && (
            <Card className="w-full">
              <TextField value="Editing:" />
              <Comment
                author={activity?.comment?.author?.full_name}
                avatar={activity?.comment?.author?.avatar}
                content={activity?.comment?.content}
                datetime={dayjs(activity?.comment?.created_at)
                  .utc(true)
                  .fromNow()}
              />
            </Card>
          )}
          {activity?.type === "reply" && (
            <Card>
              <TextField value="Reply to:" />
              <Comment
                author={activity?.comment?.author?.full_name}
                avatar={activity?.comment?.author?.avatar}
                content={
                  activity?.comment.blocked
                    ? "Blocked Comment"
                    : activity?.comment?.content
                }
                datetime={dayjs(activity?.comment?.created_at)
                  .utc(true)
                  .fromNow()}
              />
            </Card>
          )}
        </>
      )}
      <Form {...formProps} layout="vertical" className="w-full">
        <Form.Item
          name="contribution_id"
          initialValue={contribution_id}
          hidden
        />
        <Form.Item
          name="parent_id"
          initialValue={
            activity?.type === "reply" ? activity?.comment?.id : undefined
          }
          hidden
        />
        <Form.Item
          name="content"
          initialValue={
            activity?.type === "edit" ? activity?.comment?.content : undefined
          }
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item name={"is_anonymous"} valuePropName="checked">
          <Checkbox>Anonymously</Checkbox>
        </Form.Item>
        <Space>
          <SaveButton {...saveButtonProps}>
            {activity?.type === "reply"
              ? "Reply"
              : activity?.type === "edit"
              ? "Update Comment"
              : "Add Comment"}
          </SaveButton>
          {activity?.comment?.id && <Button onClick={onFinish}>Cancel</Button>}
        </Space>
      </Form>
    </Space>
  );
};

export default CommentEditor;
