import Link from "next/link";
import { AudioLines } from "lucide-react";

export default function Brand({ href = "/home" }) {
  return <Link className="brand" href={href} prefetch={false}>
    <span className="brand-mark"><AudioLines size={22} /></span>EchoDrop<span className="brand-dot">.</span>
  </Link>;
}
