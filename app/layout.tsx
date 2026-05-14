import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Norma — Il diritto a portata di swipe",
  description: "Il diritto semplice, a spiegarlo ci pensiamo noi.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Norma",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#041428",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${montserrat.variable} h-full antialiased`}>
      <head>
        <link rel="manifest" href="/manifest.json" />

        <meta
          name="apple-mobile-web-app-capable"
          content="yes"
        />

        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        <meta
          name="apple-mobile-web-app-title"
          content="Norma"
        />

        <link
          rel="apple-touch-icon"
          href="/icon-192.png"
        />
      </head>

      <body
        className="min-h-full flex flex-col"
        style={{ background: "#0a0d18" }}
      >
        {children}

        {/* OneSignal SDK */}
        <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          strategy="afterInteractive"
        />

        {/* OneSignal Init */}
        <Script id="onesignal-init" strategy="afterInteractive">
          {`
            window.OneSignalDeferred = window.OneSignalDeferred || [];

            OneSignalDeferred.push(async function(OneSignal) {

              await OneSignal.init({
                appId: "cb2f63d9-6736-47a6-97e7-913f41abd463",

                notifyButton: {
                  enable: true,
                },

                allowLocalhostAsSecureOrigin: true,
              });

              await OneSignal.Notifications.requestPermission();
            });
          `}
        </Script>

        {/* Service Worker */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function () {

                navigator.serviceWorker.register('/OneSignalSDKWorker.js')
                  .then(function (reg) {
                    console.log('SW registrato:', reg.scope);
                  })
                  .catch(function (err) {
                    console.log('SW errore:', err);
                  });

              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}