import { Comment, Icon } from "@ant-design/compatible";
import { BaseKey, useCustom } from "@refinedev/core";
import React from "react";
import dayjs from "../../libs/dayjs";
import { Button } from "antd";
import { getReacted } from "../../utils/reaction";
import { REACTION_TYPE, reactionIcons } from "../../enums/reaction.enum";

interface ICommentsProps {
  comments?: any[];
  id?: number;
  mutate: any;
  refetch: () => void;
}
interface ICommentListProps
  extends Omit<ICommentsProps, "refetch" | "comments"> {
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

  return (
    <Comments {...rest} comments={data?.data as any[]} refetch={refetch} />
  );
};

export default CommentList;

const Comments = ({ comments, ...rest }: ICommentsProps) => {
  const { mutate, id, refetch } = rest;
  return (
    <>
      {comments?.map((comment) => {
        const reaction = comment.reaction;
        const reacted = getReacted(comment.reactions, id);

        return (
          <Comment
            className="bg-transparent"
            author={comment.author?.full_name}
            avatar={comment.author?.avatar}
            content={comment.content}
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
              <Button type="text" key="reply" icon={<Icon type="rollback" />}>
                {" "}
                {comment?.children?.length}
              </Button>,
            ]}
          >
            <Comments {...rest} comments={comment.children} />
          </Comment>
        );
      })}
    </>
  );
};
