import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "EchoDrop",
  description: "Anonymous city message board"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
