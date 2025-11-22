import Providers from '@/components/layout/providers';
import { fontVariables } from '@/lib/font';
import ThemeProvider from '@/components/layout/ThemeToggle/theme-provider';
import { cn } from '@/lib/utils';
import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';
import './theme.css';
import { Toaster } from 'sonner';
import UserProvider from '@/lib/userProvider';
import ClarityProvider from "../providers/ClarityProvider";
import GtagProvider from '@/providers/GtagProvider';
const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b'
};

export const metadata: Metadata = {
   metadataBase: new URL("https://affiliate.raikaphotography.com"), 
  title: 'Affiliate Program | Raika Photography',
  description:
    'Join the Raika Photography Affiliate Program. Refer clients, earn commission, and access premium marketing materials. Trusted studio for maternity, newborn, baby, and family photography in Bangalore.',

  keywords: [
    'Raika Photography affiliate',
    'refer and earn photography',
    'photography affiliate program',
    'baby photoshoot Bangalore',
    'maternity photoshoot Bangalore',
    'newborn photographer Bangalore',
    'family photography Bangalore',
    'best photography studio in Bangalore',
    'Jayanagar photography studio',
    'professional photographers near me',
    'marketing materials',
    'brand assets',
    'promotional content',
    'affiliate earnings',
  ],

  openGraph: {
    title: 'Affiliate Program | Raika Photography – Refer & Earn',
    description:
      'Earn commissions by referring clients to Raika Photography. Access marketing materials for maternity, newborn, baby, and family shoots. Join the top-rated photography affiliate program in Bangalore.',
    url: 'https://affiliate.raikaphotography.com', // optional, add if available
    siteName: 'Raika Photography',
    type: 'website',
    images: ['/raika-logo.png'], // add OG image if available
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Raika Photography Affiliate Program – Refer & Earn',
    description:
      'Promote Raika Photography and earn commissions. Access affiliate resources and marketing materials.',
    images: ['/raika-logo.png'], // use large card image
  },

  robots: {
    index: true,
    follow: true,
  },
};


export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get('active_theme')?.value;
  const isScaled = activeThemeValue?.endsWith('-scaled');

  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `
          }}
        />
      </head>
      <body
        className={cn(
          'bg-background overflow-hidden overscroll-none font-sans antialiased',
          activeThemeValue ? `theme-${activeThemeValue}` : '',
          isScaled ? 'theme-scaled' : '',
          fontVariables
        )}
      >
         <GtagProvider />
        <ClarityProvider />
        <NextTopLoader showSpinner={false} />
        <NuqsAdapter>
            <Toaster richColors position="top-right" />
          <UserProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
            enableColorScheme
            >
            <Providers activeThemeValue={activeThemeValue as string}>
              {children}
            </Providers>
          </ThemeProvider>
          </UserProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
