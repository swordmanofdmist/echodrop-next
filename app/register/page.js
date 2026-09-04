"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", city: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Registration failed.");
      return;
    }

    router.push("/home");
  }

  return (
    <main className="auth-page">
      <section className="auth-box">
        <h1>Create Account</h1>

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
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
          <input
            className="field"
            placeholder="City"
            value={form.city}
            onChange={(event) => setForm({ ...form, city: event.target.value })}
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
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p>
          Already have an account?{" "}
          <Link className="link" href="/">
            Log In
          </Link>
        </p>
      </section>
    </main>
  );
}
