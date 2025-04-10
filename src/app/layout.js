import BackgroundSection from "../components/BackgroundSection";
import { Kantumruy_Pro } from "next/font/google";
import "./globals.css";
const kantumruy_pro = Kantumruy_Pro({
    subsets: ["latin"],
    variable: "--font-kantumruy_pro",
    weight: ["400"],
  });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${kantumruy_pro.variable}`}>
        <BackgroundSection>{children}</BackgroundSection>
      </body>
    </html>
  );
}