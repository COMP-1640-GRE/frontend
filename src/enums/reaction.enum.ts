export enum ReactionType {
  LIKE = "like",
  DISLIKE = "dislike",
}

export const REACTION_TYPE = Object.values(ReactionType);

export const reactionIcons: Record<ReactionType, string> = {
  [ReactionType.LIKE]: "like",
  [ReactionType.DISLIKE]: "dislike",
};
