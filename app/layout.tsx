import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Providers from "./providers";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Rental Property",
  description: "Feel at home, away from home",
};

export default function RootLayout({ children }) {
 
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
       <Providers>
          <Navbar />
        <main className="container py-10">
              {children}
        </main>
    
       </Providers>
      
        </body>
    </html>
    </ClerkProvider>
  );
}
