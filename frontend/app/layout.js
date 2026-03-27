import { Inter, Lora, JetBrains_Mono, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import AuthInitializer from '@/components/auth/AuthInitializer';
import QueryProvider from '@/components/QueryProvider';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });
const notoUrdu = Noto_Nastaliq_Urdu({ subsets: ["arabic"], variable: "--font-noto-nastaliq-urdu", weight: ["400", "500", "600", "700"], display: "swap" });

export const metadata = {
  title: "Vela 3.0",
  description: "The Global Health Leader. Medical intelligence built completely from scratch using the Prism design system.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} ${jetbrainsMono.variable} ${notoUrdu.variable}`}>
      <body className="antialiased bg-prism-bg text-white min-h-screen">
        <QueryProvider>
          <AuthInitializer />
          <Toaster position="bottom-right" toastOptions={{ style: { background: '#111', color: '#fff', border: '1px solid #333' } }} />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
