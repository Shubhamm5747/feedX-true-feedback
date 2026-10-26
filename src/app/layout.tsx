import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '../context/AuthProvider';
import { Toaster } from "@/components/ui/sonner"
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FeedX - True Feedback',
  description: 'Real feedback from real people.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" >
      <AuthProvider>
        <body className={inter.className}>
          {children}
          <Toaster richColors/>
        </body>
      </AuthProvider>
    </html>
  );
}