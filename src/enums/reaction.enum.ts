import {
  DislikeFilled,
  DislikeOutlined,
  LikeFilled,
  LikeOutlined,
} from "@ant-design/icons";

export enum ReactionType {
  LIKE = "like",
  DISLIKE = "dislike",
}

export const REACTION_TYPE = Object.values(ReactionType);

export const reactionInactiveIcons: Record<ReactionType, typeof LikeOutlined> =
  {
    [ReactionType.LIKE]: LikeOutlined,
    [ReactionType.DISLIKE]: DislikeOutlined,
  };

export const reactionActiveIcons: Record<ReactionType, typeof LikeOutlined> = {
  [ReactionType.LIKE]: LikeFilled,
  [ReactionType.DISLIKE]: DislikeFilled,
};
