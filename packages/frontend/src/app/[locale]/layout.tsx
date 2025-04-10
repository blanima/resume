import { NextIntlClientProvider, hasLocale } from "next-intl";
import { Mulish, Space_Mono } from "next/font/google";
import "@/styles/globals.css";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/components/themeProvider";

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${spaceMono.variable} ${mulish.variable} bg-background antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
