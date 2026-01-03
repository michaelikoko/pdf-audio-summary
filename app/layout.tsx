import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import RootProvider from "@/components/RootProvider";

export const metadata: Metadata = {
  title: "Document Summarize",
  description: "Summarize text from document and read out, change this shit later.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <RootProvider>
          <Navbar />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
