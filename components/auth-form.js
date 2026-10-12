"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Brand from "@/components/brand";
import { api } from "@/lib/api";

export default function AuthForm({ register = false }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(event.currentTarget));
    setError("");
    setLoading(true);
    try {
      await api(`/api/auth/${register ? "register" : "login"}`, { method: "POST", body });
      router.replace("/home");
      router.refresh();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return <main className="auth-page">
    <header className="auth-header"><Brand href="/" /><Link href="/home" prefetch={false}>Explore the feed <ArrowRight size={16} /></Link></header>
    <div className="auth-content">
      <div className="auth-photo" role="img" aria-label="City skyline above a neighborhood" />
      <section className="auth-form">
        <span className="eyebrow">A SPACE TO BE YOURSELF</span>
        <h1>{register ? "Join the conversation." : "Welcome back."}</h1>
        <p className="muted">{register ? "Make a little room for your voice." : "Your next conversation is just around the corner."}</p>
        <form className="stack" onSubmit={submit}>
          <label>Username<input className="field" name="username" placeholder="Your username" autoComplete="username" minLength={register ? 3 : undefined} maxLength={50} required /></label>
          {register && <>
            <label>Email<input className="field" name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></label>
            <label>City<input className="field" name="city" placeholder="Your city" autoComplete="address-level2" maxLength={100} required /></label>
          </>}
          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input id="password" className="field" name="password" type={showPassword ? "text" : "password"} placeholder={register ? "At least 6 characters" : "Your password"} autoComplete={register ? "new-password" : "current-password"} minLength={register ? 6 : undefined} required />
            <button type="button" className="icon-button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} title={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          {!register && <Link className="forgot-password-link" href="/forgot-password" prefetch={false}>Forgot password?</Link>}
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn" disabled={loading}>{loading ? "Please wait..." : register ? "Create account" : "Log in"}<ArrowRight size={18} /></button>
        </form>
        <p className="auth-switch">{register ? "Already part of EchoDrop?" : "New around here?"} <Link className="link" href={register ? "/" : "/register"} prefetch={false}>{register ? "Log in" : "Create an account"}</Link></p>
      </section>
    </div>
    <footer className="auth-footer">EchoDrop <span>A moment shared. A connection made.</span></footer>
  </main>;
}
