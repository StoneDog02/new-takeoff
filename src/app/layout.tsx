import type { Metadata } from "next";
import "../app/globals.css";

export const metadata: Metadata = {
  title: "Takeoff — Material Takeoff from Build Plans",
  description:
    "Upload build plans and get an exact material takeoff list for faster contractor bids.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
