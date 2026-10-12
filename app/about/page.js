import AppShell from "@/components/app-shell";
import Brand from "@/components/brand";

export default function AboutPage() {
  return <AppShell>
    <header className="page-heading"><div><span className="eyebrow">A LITTLE ABOUT US</span><h1>About EchoDrop<span className="brand-dot">.</span></h1></div></header>
    <div className="about-photo" role="img" aria-label="City buildings and neighborhood streets" />
    <section className="about-content"><Brand /><p>A place for the everyday thoughts that bring a city a little closer.</p><p className="muted">Made for the moments in between.</p></section>
  </AppShell>;
}
