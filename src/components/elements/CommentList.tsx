import { Comment, Icon } from "@ant-design/compatible";
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { BaseKey, useCustom, useDelete } from "@refinedev/core";
import { Button, Card, Popover, Space } from "antd";
import { REACTION_TYPE, reactionIcons } from "../../enums/reaction.enum";
import dayjs from "../../libs/dayjs";
import { getReacted } from "../../utils/reaction";
import { useState } from "react";
import CommentEditor from "./CommentEditor";

export type CommentActivity = {
  comment: any;
  type: "reply" | "edit";
};

interface ICommentsProps {
  comments?: any[];
  id?: number;
  mutate: any;
  deleteMutation: any;
  refetch: () => void;
  setActivity: (activity: CommentActivity) => void;
}
interface ICommentListProps
  extends Omit<
    ICommentsProps,
    "refetch" | "comments" | "deleteMutation" | "setActivity"
  > {
  contribution_id?: BaseKey;
}

const CommentList = ({ contribution_id, ...rest }: ICommentListProps) => {
  const { data, refetch } = useCustom({
    method: "get",
    url: `/contributions/${contribution_id}/comments`,
    queryOptions: {
      enabled: !!contribution_id,
    },
  });

  const { mutate: deleteMutation } = useDelete();
  const [activity, setActivity] = useState<CommentActivity>();

  if (!data?.data) return <></>;

  return (
    <Space direction="vertical" className="w-full">
      <Card
        bordered={false}
        className="overflow-auto h-[50vh] bg-transparent w-full"
      >
        <Comments
          {...rest}
          comments={data?.data as any[]}
          refetch={refetch}
          deleteMutation={deleteMutation}
          setActivity={setActivity}
        />
      </Card>
      <CommentEditor
        key={activity?.comment?.id}
        contribution_id={contribution_id}
        onFinish={() => {
          refetch();
          setActivity(undefined);
        }}
        activity={activity}
      />
    </Space>
  );
};

export default CommentList;

const Comments = ({ comments, ...rest }: ICommentsProps) => {
  const { mutate, id, refetch, setActivity, deleteMutation } = rest;
  return (
    <>
      {comments
        ?.sort(
          (a, b) =>
            new Date(a?.created_at).getTime() -
            new Date(b?.created_at).getTime()
        )
        ?.map((comment) => {
          const reaction = comment.reaction;
          const reacted = getReacted(comment.reactions, id);
          const canEdit = id === comment.author?.id;
          return (
            <>
              <div className="group relative" key={comment?.id}>
                <Comment
                  className="bg-transparent"
                  author={comment.author?.full_name}
                  avatar={comment.author?.avatar}
                  content={
                    comment.blocked ? (
                      <p className="text-red-400">
                        This comment has been blocked
                      </p>
                    ) : (
                      comment.content
                    )
                  }
                  datetime={dayjs(comment?.created_at).utc(true).fromNow()}
                  actions={[
                    ...REACTION_TYPE.map((item) => {
                      return (
                        <Button
                          type="text"
                          size="large"
                          icon={
                            <Icon
                              type={reactionIcons[item]}
                              theme={reacted === item ? "filled" : "outlined"}
                            />
                          }
                          key={item}
                          onClick={() =>
                            mutate(
                              {
                                method: "post",
                                url: `comments/${comment?.id}/reaction`,
                                values: { type: item },
                                successNotification: {
                                  message: "Reacted",
                                  type: "success",
                                },
                              },
                              {
                                onSuccess: refetch,
                              }
                            )
                          }
                        >
                          {" "}
                          {reaction[item]}
                        </Button>
                      );
                    }),
                    <Button
                      type="text"
                      key="reply"
                      icon={<Icon type="rollback" />}
                      onClick={() => setActivity({ comment, type: "reply" })}
                    >
                      {" "}
                      {comment?.children?.length}
                    </Button>,
                  ]}
                />
                {canEdit && (
                  <Popover
                    content={
                      <Space direction="vertical">
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() =>
                            setActivity({
                              comment,
                              type: "edit",
                            })
                          }
                          style={{ width: "100%" }}
                        >
                          Edit
                        </Button>
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          danger
                          style={{ width: "100%" }}
                          onClick={() =>
                            deleteMutation(
                              { id: comment?.id, resource: "comments" },
                              { onSuccess: refetch }
                            )
                          }
                        >
                          Delete
                        </Button>
                      </Space>
                    }
                  >
                    <Button
                      type="text"
                      icon={
                        <InfoCircleOutlined className="opacity-0 group-hover:opacity-100" />
                      }
                      shape="circle"
                      className="transition-all duration-300 max-h-0 max-w-0 group-hover:max-h-20 group-hover:max-w-20 absolute top-1/2 right-0 -translate-x-full -translate-y-full overflow-hidden"
                    />
                  </Popover>
                )}
              </div>
              <div className="ml-10">
                <Comments {...rest} comments={comment.children} />
              </div>
            </>
          );
        })}
    </>
  );
};
