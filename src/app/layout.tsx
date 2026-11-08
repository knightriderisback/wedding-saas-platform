import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ÉTERNITÉ | Haute Couture Royal Wedding Platform',
  description: 'Ultra-luxury bespoke digital wedding invitations, mobile client operating system, and royal interactive guest portal.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Great+Vibes&family=Montserrat:ital,wght@0,200;0,300;0,400;0,500;0,600;1,300&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FAF8F5] text-[#2C2218] min-h-screen selection:bg-[#D4AF37]/30 selection:text-[#2C2218] antialiased">
        {children}
      </body>
    </html>
  );
}
