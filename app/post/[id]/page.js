"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PostPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPost() {
      const response = await fetch(`/api/posts/${id}`);
      if (!response.ok) {
        setError("Failed to load post.");
        return;
      }

      setPost(await response.json());
    }

    loadPost();
  }, [id]);

  async function likePost() {
    const response = await fetch(`/api/posts/${id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isUpvote: true })
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Failed to like post.");
      return;
    }

    setPost({ ...post, upvoteCount: data.upvotes, downvoteCount: data.downvotes });
  }

  async function submitComment(event) {
    event.preventDefault();
    const text = comment.trim();
    if (!text || post?.isExpired) return;

    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: id, content: text })
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Failed to post comment.");
      return;
    }

    setComment("");
    setPost({ ...post, comments: [data, ...post.comments], commentCount: post.commentCount + 1 });
  }

  async function deletePost() {
    const response = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Failed to delete post.");
      return;
    }

    router.push("/home");
  }

  return (
    <main className="shell">
      <header className="topbar">
        <Link className="brand" href="/home">
          EchoDrop
        </Link>
        <nav className="nav">
          <Link href="/home">Feed</Link>
          <Link href="/profile">Profile</Link>
        </nav>
      </header>

      {error && <p className="error">{error}</p>}
      {!post && !error && <p className="muted">Loading post...</p>}

      {post && (
        <>
          <article className="post">
            <p className="post-content">
              {post.content}
              {post.isExpired ? " (expired)" : ""}
            </p>
            <div className="post-meta">
              <span>{post.city}</span>
              <span>{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <div className="post-actions">
              <button className="vote" onClick={likePost} aria-label="Like post">
                Like
              </button>
              <span>{post.upvoteCount} like(s)</span>
              <span>{post.downvoteCount} downvote(s)</span>
              {post.canDelete && (
                <button className="btn secondary" onClick={deletePost}>
                  Delete
                </button>
              )}
            </div>
          </article>

          <section className="comments">
            <h2>Comments</h2>
            {post.comments.map((item) => (
              <div className="comment" key={item.id}>
                {item.content}
              </div>
            ))}
            {post.comments.length === 0 && <p className="muted">No comments yet.</p>}

            <form className="stack" onSubmit={submitComment}>
              <textarea
                className="textarea"
                maxLength={300}
                placeholder={post.isExpired ? "Comments are disabled on expired posts." : "Write a comment..."}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                disabled={post.isExpired}
              />
              <div className="composer-footer">
                <span className="muted">{comment.length}/300</span>
                <button className="btn" disabled={post.isExpired}>
                  Post Comment
                </button>
              </div>
            </form>
          </section>
        </>
      )}
    </main>
  );
}
