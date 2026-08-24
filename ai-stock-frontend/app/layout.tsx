import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Trade AI | Options Flow',
  description: 'Institutional Options Flow Intelligence',
  manifest: '/manifest.json', // <-- ADD THIS LINE
};

export const viewport: Viewport = {
  themeColor: '#020617', // <-- ADD THIS BLOCK for the top phone status bar color
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}