"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      const response = await fetch("/api/posts");
      if (response.status === 401) {
        router.push("/");
        return;
      }

      if (!response.ok) {
        setError("Error loading feed.");
        setLoading(false);
        return;
      }

      setPosts(await response.json());
      setLoading(false);
    }

    loadPosts();
  }, [router]);

  async function submitPost(event) {
    event.preventDefault();
    const text = content.trim();
    if (!text) return;

    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text })
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Failed to post.");
      return;
    }

    setContent("");
    setPosts([data, ...posts]);
  }

  async function likePost(postId) {
    const response = await fetch(`/api/posts/${postId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isUpvote: true })
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Failed to like post.");
      return;
    }

    const data = await response.json();
    setPosts((current) =>
      current.map((post) =>
        post.id === postId ? { ...post, upvoteCount: data.upvotes, downvoteCount: data.downvotes } : post
      )
    );
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <main className="shell">
      <header className="topbar">
        <Link className="brand" href="/home">
          EchoDrop
        </Link>
        <nav className="nav">
          <Link href="/profile">Profile</Link>
          <Link href="/about">About</Link>
          <button onClick={logout}>Log Out</button>
        </nav>
      </header>

      <form className="composer" onSubmit={submitPost}>
        <textarea
          className="textarea"
          maxLength={300}
          placeholder="What's on your mind?"
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
        <div className="composer-footer">
          <span className="muted">{content.length}/300</span>
          <button className="btn">Post</button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading feed...</p>}

      <section className="feed">
        {posts.map((post) => (
          <article className="post" key={post.id}>
            <Link href={`/post/${post.id}`} className="post-content">
              {post.content.length > 124 ? `${post.content.slice(0, 124)}...` : post.content}
            </Link>
            <div className="post-meta">
              <span>{post.city}</span>
              <span>{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <div className="post-actions">
              <button className="vote" onClick={() => likePost(post.id)} aria-label="Like post">
                Like
              </button>
              <span>{post.upvoteCount} like(s)</span>
              <span>{post.commentCount} comment(s)</span>
            </div>
          </article>
        ))}
        {!loading && posts.length === 0 && <p className="muted">No active posts yet.</p>}
      </section>
    </main>
  );
}
