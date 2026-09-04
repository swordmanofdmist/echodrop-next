export function postSummary(post, commentCount = 0) {
  const now = new Date();

  return {
    id: post._id.toString(),
    content: post.content,
    username: post.user?.username ?? "anonymous",
    city: post.city,
    createdAt: post.createdAt,
    expiresAt: post.expiresAt,
    isExpired: now >= post.expiresAt,
    upvoteCount: post.upvoteCount,
    downvoteCount: post.downvoteCount,
    commentCount
  };
}

export function commentDto(comment) {
  return {
    id: comment._id.toString(),
    content: comment.content,
    createdAt: comment.createdAt
  };
}
