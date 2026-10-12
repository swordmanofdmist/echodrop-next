"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Clock3, Heart, MapPin, MessageCircle, Trash2 } from "lucide-react";

export default function PostCard({ post, onLike, onDelete, busy = false, detail = false }) {
  return <article className="post">
    <div className="post-heading"><span className="avatar"><MapPin size={19} /></span>
      <div><strong>Someone in {post.city}</strong><time dateTime={post.createdAt}>{new Date(post.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</time></div>
      <span className={`post-lifetime ${post.isExpired ? "expired" : ""}`}><Clock3 size={13} />{post.isExpired ? "Expired" : "24h drop"}</span>
    </div>
    {detail ? <p className="post-content">{post.content}</p> : <Link href={`/post/${post.id}`} prefetch={false} className="post-content">{post.content}</Link>}
    {post.images?.length > 0 && <div className="post-images">{post.images.map((image) => <img key={image} className="post-image" src={`/uploads/${image}`} alt="" loading="lazy" />)}</div>}
    <div className="post-actions">
      {onLike ? <button className="action-button" onClick={onLike} disabled={busy} title="Toggle like" aria-label={`Like post, ${post.upvoteCount} likes`}><Heart size={17} />{post.upvoteCount}</button> : <span><Heart size={17} />{post.upvoteCount}</span>}
      <Link href={`/post/${post.id}`} prefetch={false} aria-label={`${post.commentCount} comments`}><MessageCircle size={17} />{post.commentCount}<span className="comment-label">comments</span></Link>
      {onDelete && <button className="icon-button delete-button" onClick={onDelete} disabled={busy} title="Delete post" aria-label="Delete post"><Trash2 size={17} /></button>}
    </div>
  </article>;
}
