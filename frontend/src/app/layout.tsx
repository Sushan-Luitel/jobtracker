import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Initialize the Inter font
const inter = Inter({ subsets: ['latin'] });

const appTitle = 'Job Tracker';
const appDescription = 'Track your job applications through every stage of the hiring process';

export const metadata: Metadata = {
  title: appTitle,
  description: appDescription,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
