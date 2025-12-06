import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";

export const metadata: Metadata = {
  title: "TMSE Pizza - Mom & Pop's Pizza Shop",
  description: "Order delicious pizza from TMSE Pizza. Build your own or choose from our specialty menu. Fresh ingredients, family recipes since 1984.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
