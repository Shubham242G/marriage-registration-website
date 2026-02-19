import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: "Register My Marriage — Official Marriage Registration Portal",
  description:
    "India's trusted marriage registration service for all religions. Legal, digital, and hassle-free.",
  keywords: [
    "marriage registration India",
    "register my marriage",
    "nikah registration",
    "vivah registration",
    "Hindu marriage act",
    "special marriage act",
    "marriage certificate India",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#fafffe" }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}