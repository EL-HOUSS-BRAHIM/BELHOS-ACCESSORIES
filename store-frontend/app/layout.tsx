import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { DataSourceProvider } from "@/lib/DataSourceContext";

export const metadata: Metadata = {
  title: "BELHOS Accessories - Boutique en ligne",
  description: "Découvrez notre collection d'accessoires de luxe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <AuthProvider>
          <DataSourceProvider>
            <main className="min-h-screen">{children}</main>
          </DataSourceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
