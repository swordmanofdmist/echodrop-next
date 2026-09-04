import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="center-page">
      <section className="about-box">
        <h1>About EchoDrop</h1>
        <p>EchoDrop is a simple anonymous city message board.</p>
        <p>Posts expire after 24 hours. Registered users can post, comment, and like messages.</p>
        <Link className="link" href="/home">
          Back to Home
        </Link>
      </section>
    </main>
  );
}
