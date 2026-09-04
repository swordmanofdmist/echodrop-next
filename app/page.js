"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Login failed.");
      return;
    }

    router.push("/home");
  }

  return (
    <main className="auth-page">
      <section className="auth-box">
        <h1>Welcome Back</h1>
        <p>Please enter your credentials to continue.</p>

        <form onSubmit={submit}>
          <input
            className="field"
            placeholder="Username"
            value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })}
            required
          />
          <input
            className="field"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
          {error && <p className="error">{error}</p>}
          <button className="btn" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p>
          Not a member yet?{" "}
          <Link className="link" href="/register">
            Join EchoDrop today.
          </Link>
        </p>
      </section>
    </main>
  );
}
