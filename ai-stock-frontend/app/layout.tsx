import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react'; // <-- 1. Import it here
import './globals.css';

export const metadata: Metadata = {
  title: 'AlphaBlue',
  description: 'Institutional US equity research, multi-horizon price targets, and smart money positioning powered by Gemini.',
  manifest: '/manifest.json', 
};

export const viewport: Viewport = {
  themeColor: '#020617', 
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics /> {/* <-- 2. Place it anywhere inside the body tag */}
      </body>
    </html>
  );
}