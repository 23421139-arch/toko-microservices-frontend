import { Inter } from "next/font/google";
import "./globals.css"; // <--- INI WAJIB ADA!

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin Toko Microservices",
  description: "Manajemen Toko Elektronik",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}