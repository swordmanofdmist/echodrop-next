"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const meResponse = await fetch("/api/auth/me");
      if (meResponse.status === 401) {
        router.push("/");
        return;
      }

      if (!meResponse.ok) {
        setError("Failed to load profile.");
        return;
      }

      const me = await meResponse.json();
      setUser(me.user);

      const postsResponse = await fetch("/api/posts/mine");
      if (postsResponse.ok) {
        setPosts(await postsResponse.json());
      }
    }

    loadProfile();
  }, [router]);

  return (
    <main className="shell">
      <header className="topbar">
        <Link className="brand" href="/home">
          EchoDrop
        </Link>
        <nav className="nav">
          <Link href="/home">Feed</Link>
          <Link href="/about">About</Link>
        </nav>
      </header>

      {error && <p className="error">{error}</p>}

      {user && (
        <section className="post">
          <h1>{user.username}</h1>
          <p className="muted">{user.email}</p>
          <p className="muted">{user.city}</p>
        </section>
      )}

      <section className="comments">
        <h2>My Posts</h2>
        {posts.map((post) => (
          <Link className="post" href={`/post/${post.id}`} key={post.id}>
            <span className="post-content">
              {post.content.length > 124 ? `${post.content.slice(0, 124)}...` : post.content}
            </span>
            <span className="post-actions">
              <span>{post.upvoteCount} like(s)</span>
              <span>{post.commentCount} comment(s)</span>
              {post.isExpired && <span>Expired</span>}
            </span>
          </Link>
        ))}
        {posts.length === 0 && <p className="muted">You have not posted anything yet.</p>}
      </section>
    </main>
  );
}
