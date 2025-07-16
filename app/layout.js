import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./_components/Nav";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Learning Nav",
  description: "A Learner's Best Friend",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`bg-black bg-gradient-to-br from-blue-900 via-black to-cyan-900 grid `}
      >
        <Nav />
        <div classname="pt-36">
        {children}
        </div>
      </body>
    </html>
  );
}
