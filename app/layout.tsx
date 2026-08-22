import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'FinTools India — Smart Financial Calculators & PDF Tools',
  description:
    'All-in-one financial calculators for India (EMI, SIP, Tax AY 25-26, FD, PPF, GST) and client-side PDF utilities (Merge, Compress, Split, Rotate). 100% private, free, and instant.',
  keywords: [
    'EMI Calculator India',
    'SIP Calculator',
    'Income Tax Calculator AY 2025-26',
    'Merge PDF Online Free',
    'Compress PDF',
    'Home Loan EMI Calculator',
    'GST Calculator',
    'PPF Calculator',
    'FD Calculator India',
  ],
};

const themeScript = `
  (function() {
    try {
      var stored = localStorage.getItem('fintools_theme');
      var isDark = false;
      if (stored === 'dark') {
        isDark = true;
      } else if (stored === 'light') {
        isDark = false;
      } else {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
        <ThemeProvider>
          <Header />
          <div className="flex-1 w-full">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
