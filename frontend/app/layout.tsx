import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FeedPulse | AI-Powered Product Feedback",
  description: "Identify product trends and blockers with Gemini AI analysis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Global Mesh Gradient Background */}
        <div className="fixed inset-0 -z-10 bg-[#F0F9FF]">
          <div className="absolute inset-0 bg-[radial-gradient(at_0%_0%,_hsla(197,100%,96%,1)_0,transparent_50%),radial-gradient(at_50%_0%,_hsla(225,100%,96%,1)_0,transparent_50%),radial-gradient(at_100%_0%,_hsla(170,100%,96%,1)_0,transparent_50%),radial-gradient(at_50%_100%,_hsla(260,100%,98%,1)_0,transparent_50%)]" />
        </div>
        
        {/* Requirement 1.5: Success and Error notifications */}
        <Toaster position="top-center" reverseOrder={false} />
        {children}
      </body>
    </html>
  );
}
