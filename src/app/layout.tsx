import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Royal Vivah | Shubh Vivah Wedding Invitation',
  description: 'Ultra-luxury bespoke digital royal wedding invitations and interactive guest microsite.',
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
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cinzel:wght@400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Great+Vibes&family=Lato:ital,wght@0,300;0,400;0,700;1,300&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Martel:wght@400;600;700;800&family=Montserrat:ital,wght@0,200;0,300;0,400;0,500;0,600;1,300&family=Noto+Nastaliq+Urdu:wght@400;700&family=Noto+Sans+Devanagari:wght@400;500;600;700;800;900&family=Noto+Serif+Devanagari:wght@400;500;600;700;800;900&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Rozha+One&family=Tiro+Devanagari+Hindi:ital@0;1&family=Yatra+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#1A2218] text-[#2C2218] min-h-screen selection:bg-[#D4AF37]/30 selection:text-[#2C2218] antialiased">
        {children}
      </body>
    </html>
  );
}
