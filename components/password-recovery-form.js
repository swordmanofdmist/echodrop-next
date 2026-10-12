"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Brand from "@/components/brand";
import { api } from "@/lib/api";

export default function PasswordRecoveryForm() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    setError("");
    setMessage("");

    if (body.password !== body.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const data = await api("/api/auth/forgot-password", {
        method: "POST",
        body: { email: body.email, password: body.password }
      });
      setMessage(data.message);
      form.reset();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return <main className="auth-page">
    <header className="auth-header"><Brand href="/" /><Link href="/" prefetch={false}><ArrowLeft size={16} />Back to log in</Link></header>
    <div className="auth-content">
      <div className="auth-photo" role="img" aria-label="City skyline above a neighborhood" />
      <section className="auth-form">
        <span className="eyebrow">ACCOUNT RECOVERY</span>
        <h1>Choose a new password.</h1>
        <p className="muted">Enter your account email and choose the password you want to use.</p>
        {message ? <>
          <p className="success" role="status">{message}</p>
          <Link className="link" href="/" prefetch={false}>Return to log in</Link>
        </> : <form className="stack" onSubmit={submit}>
          <label>Email<input className="field" name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></label>
          <label htmlFor="password">New password</label>
          <div className="password-field">
            <input id="password" className="field" name="password" type={showPassword ? "text" : "password"} placeholder="At least 6 characters" autoComplete="new-password" minLength={6} required />
            <button type="button" className="icon-button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} title={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          <label>Confirm new password<input className="field" name="confirmPassword" type={showPassword ? "text" : "password"} placeholder="Enter it again" autoComplete="new-password" minLength={6} required /></label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn" disabled={loading}>{loading ? "Please wait..." : "Reset password"}<ArrowRight size={18} /></button>
        </form>}
      </section>
    </div>
    <footer className="auth-footer">EchoDrop <span>A moment shared. A connection made.</span></footer>
  </main>;
}
