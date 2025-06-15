import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Calendra',
  description:
    'Calendra — это простое и эффективное приложение-календарь, которое поможет вам с легкостью управлять своими событиями, встречами и расписанием. Будьте организованны и больше никогда не пропустите важную дату!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='ru'>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased animate-fade-in`}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
