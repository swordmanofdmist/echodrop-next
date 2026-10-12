"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, MessageCircle, Send } from "lucide-react";
import AppShell from "@/components/app-shell";
import PostCard from "@/components/post-card";
import { api } from "@/lib/api";
import { useResource } from "@/lib/use-resource";

export default function PostPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: post, setData: setPost, error, setError, loading } = useResource(`/api/posts/${id}`);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  async function act(action) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }

  function likePost() {
    return act(async () => {
      const data = await api(`/api/posts/${id}/vote`, { method: "POST", body: { isUpvote: true } });
      setPost((current) => ({ ...current, upvoteCount: data.upvotes, downvoteCount: data.downvotes }));
    });
  }

  function submitComment(event) {
    event.preventDefault();
    if (!comment.trim() || post?.isExpired) return;
    return act(async () => {
      const data = await api("/api/comments", { method: "POST", body: { postId: id, content: comment.trim() } });
      setPost((current) => ({ ...current, comments: [data, ...current.comments], commentCount: current.commentCount + 1 }));
      setComment("");
    });
  }

  function deletePost() {
    if (!window.confirm("Delete this post and its comments?")) return;
    return act(async () => {
      await api(`/api/posts/${id}`, { method: "DELETE" });
      router.replace("/home");
    });
  }

  return <AppShell>
    <Link className="back-link" href="/home" prefetch={false}><ArrowLeft size={17} />Back to the feed</Link>
    <header className="page-heading"><div><span className="eyebrow">A MOMENT TO CONNECT</span><h1>The conversation<span className="brand-dot">.</span></h1></div></header>
    {error && <p className="error" role="alert">{error}</p>}
    {loading && <p className="empty-state" role="status">Loading conversation...</p>}
    {post && <>
      <PostCard post={post} detail onLike={likePost} onDelete={post.canDelete ? deletePost : undefined} busy={busy} />
      <div className="section-heading"><h2>Comments</h2><span className="muted">{post.commentCount}</span></div>
      <form className="comment-composer stack" onSubmit={submitComment}>
        <label htmlFor="comment">Add your voice</label>
        <textarea id="comment" className="textarea" maxLength={300} placeholder={post.isExpired ? "This conversation has expired." : "Leave a kind thought..."} value={comment} onChange={(event) => setComment(event.target.value)} disabled={post.isExpired || busy} required />
        <div className="composer-footer"><span className="muted">{comment.length} / 300</span><button className="btn" disabled={post.isExpired || busy || !comment.trim()}><Send size={16} />{busy ? "Please wait..." : "Post comment"}</button></div>
      </form>
      <section className="comments" aria-label="Comments">{post.comments.map((item) => <article className="comment" key={item.id}><span className="avatar"><MessageCircle size={17} /></span><div><strong>Someone nearby</strong><p>{item.content}</p><time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString()}</time></div></article>)}
        {post.comments.length === 0 && <p className="empty-state">No comments yet. Start the conversation.</p>}
      </section>
    </>}
  </AppShell>;
}
