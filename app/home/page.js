"use client";

import { useState } from "react";
import { ArrowUpRight, AudioLines, Image as ImageIcon, RefreshCw, Send } from "lucide-react";
import AppShell from "@/components/app-shell";
import PostCard from "@/components/post-card";
import { api } from "@/lib/api";
import { useResource } from "@/lib/use-resource";

export default function HomePage() {
  const { data: posts, setData: setPosts, error, setError, loading, reload } = useResource("/api/posts");
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [voting, setVoting] = useState(null);
  const [sort, setSort] = useState("latest");
  const sortedPosts = sort === "popular" ? [...(posts || [])].sort((a, b) => b.upvoteCount - a.upvoteCount) : posts || [];

  async function submitPost(event) {
    event.preventDefault();
    if (!content.trim() || posting) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("content", content.trim());
    setPosting(true);
    setError("");
    try {
      const post = await api("/api/posts", { method: "POST", body: formData });
      setPosts((current) => [post, ...(current || [])]);
      setContent("");
      form.reset();
    } catch (error) {
      setError(error.message);
    } finally {
      setPosting(false);
    }
  }

  async function likePost(id) {
    setVoting(id);
    setError("");
    try {
      const result = await api(`/api/posts/${id}/vote`, { method: "POST", body: { isUpvote: true } });
      setPosts((current) => current.map((post) => post.id === id ? { ...post, upvoteCount: result.upvotes, downvoteCount: result.downvotes } : post));
    } catch (error) {
      setError(error.message);
    } finally {
      setVoting(null);
    }
  }

  return <AppShell>
    <header className="page-heading"><div><span className="eyebrow">THE LOCAL PULSE</span><h1>The feed<span className="brand-dot">.</span></h1><p className="muted">Small thoughts. Shared moments. Your city, unfiltered.</p></div><ArrowUpRight className="heading-icon" size={32} /></header>
    <form className="composer" onSubmit={submitPost}>
      <label htmlFor="post-content"><span className="avatar coral"><AudioLines size={20} /></span>Leave a little thought.</label>
      <textarea id="post-content" name="content" className="textarea" maxLength={300} placeholder="What's on your mind today?" value={content} onChange={(event) => setContent(event.target.value)} required />
      <label className="image-field" htmlFor="post-images"><ImageIcon size={16} />Images</label>
      <input id="post-images" className="field" name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple />
      <div className="composer-footer"><span className="muted">{content.length} / 300</span><button className="btn" disabled={posting || !content.trim() || loading}><Send size={16} />{posting ? "Posting..." : "Drop a thought"}</button></div>
    </form>
    <div className="feed-toolbar"><div className="segmented" aria-label="Sort posts">{["latest", "popular"].map((value) => <button key={value} onClick={() => setSort(value)} aria-pressed={sort === value}>{value === "latest" ? "Latest" : "Most liked"}</button>)}</div><button className="icon-button" onClick={reload} disabled={loading || posting || voting !== null} aria-label="Refresh feed" title="Refresh feed"><RefreshCw size={18} className={loading ? "spin" : ""} /></button></div>
    {error && <p className="error" role="alert">{error}</p>}
    {loading ? <p className="empty-state" role="status">Loading the latest drops...</p> : <section className="feed" aria-label="Posts">
      {sortedPosts.map((post) => <PostCard key={post.id} post={post} onLike={() => likePost(post.id)} busy={voting !== null} />)}
      {!error && sortedPosts.length === 0 && <div className="empty-state"><AudioLines size={32} aria-hidden="true" /><h2>A quiet moment.</h2><p>Be the first to share a thought with your city.</p></div>}
    </section>}
  </AppShell>;
}
