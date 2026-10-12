"use client";

import { MapPin, UserRound } from "lucide-react";
import AppShell from "@/components/app-shell";
import PostCard from "@/components/post-card";
import { useResource } from "@/lib/use-resource";

export default function ProfilePage() {
  const profile = useResource("/api/auth/me");
  const posts = useResource("/api/posts/mine");
  const user = profile.data?.user;

  return <AppShell>
    <header className="page-heading"><div><span className="eyebrow">YOUR LITTLE CORNER</span><h1>My profile<span className="brand-dot">.</span></h1></div><UserRound className="heading-icon" size={30} /></header>
    {(profile.error || posts.error) && <p className="error" role="alert">{profile.error || posts.error}</p>}
    {profile.loading && <p className="muted" role="status">Loading your profile...</p>}
    {user && <section className="profile-summary"><span className="profile-avatar">{user.username.slice(0, 1).toUpperCase()}</span><div><h2>{user.username}</h2><p className="muted">{user.email}</p><span className="location"><MapPin size={15} />{user.city}</span></div></section>}
    <div className="section-heading"><h2>My drops</h2><span className="muted">{posts.data?.length ?? 0} total</span></div>
    {posts.loading ? <p className="empty-state" role="status">Loading your drops...</p> : <section className="feed" aria-label="My posts">
      {posts.data?.map((post) => <PostCard key={post.id} post={post} />)}
      {!posts.error && posts.data?.length === 0 && <div className="empty-state"><h2>Your story starts here.</h2><p>You have not shared a drop yet.</p></div>}
    </section>}
  </AppShell>;
}
