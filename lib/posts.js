import Comment from "@/models/Comment";
import Post from "@/models/Post";
import { postSummary } from "@/lib/serialize";

export async function listPosts(query) {
  const posts = await Post.find(query).populate("user", "username").sort({ createdAt: -1 });
  const counts = await Comment.aggregate([
    { $match: { post: { $in: posts.map((post) => post._id) } } },
    { $group: { _id: "$post", count: { $sum: 1 } } }
  ]);
  const countMap = new Map(counts.map((item) => [item._id.toString(), item.count]));
  return posts.map((post) => postSummary(post, countMap.get(post._id.toString()) ?? 0));
}
