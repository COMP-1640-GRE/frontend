export const getReacted = (reactions: any[], id?: number) => {
  if (reactions.length === 0 || !id) return null;

  return reactions.find((reaction: any) => reaction.user?.id === id)?.type;
};
