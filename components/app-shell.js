"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Info, LayoutGrid, LogOut, MapPin, UserRound } from "lucide-react";
import { useState } from "react";
import Brand from "@/components/brand";
import { api } from "@/lib/api";

const links = [
  { href: "/home", label: "The feed", icon: LayoutGrid },
  { href: "/profile", label: "My profile", icon: UserRound },
  { href: "/about", label: "About", icon: Info }
];

export default function AppShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [error, setError] = useState("");
  const [leaving, setLeaving] = useState(false);

  async function logout() {
    setLeaving(true);
    try {
      await api("/api/auth/logout", { method: "POST" });
      router.replace("/");
      router.refresh();
    } catch (error) {
      setError(error.message);
    } finally {
      setLeaving(false);
    }
  }

  return <div className="app-layout">
    <aside className="sidebar">
      <Brand />
      <nav className="main-nav" aria-label="Main navigation">
        {links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} prefetch={false}
          className={pathname === href ? "active" : ""} aria-current={pathname === href ? "page" : undefined}>
          <Icon size={19} /><span>{label}</span>
        </Link>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="city-photo" role="img" aria-label="City skyline above a neighborhood" />
        <p className="city-caption"><MapPin size={15} /> A little closer to your city.</p>
        <button className="logout" onClick={logout} disabled={leaving}><LogOut size={18} />{leaving ? "Signing out..." : "Log out"}</button>
      </div>
    </aside>
    <main className="workspace">
      <div className="workspace-top"><span>YOUR CITY. YOUR CONVERSATIONS.</span><span className="live-label"><i /> Here for 24 hours</span></div>
      <div className="page-content">{error && <p className="error" role="alert">{error}</p>}{children}</div>
      <footer className="page-footer">EchoDrop <span>A moment shared. A connection made.</span></footer>
    </main>
  </div>;
}
