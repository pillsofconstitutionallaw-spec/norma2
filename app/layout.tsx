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
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/apple-icon-167x167-04.png", sizes: "167x167", type: "image/png" },
      { url: "/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
    ],
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
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Norma" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/apple-icon-167x167-04.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
      </head>
      <body className="min-h-full flex flex-col" style={{ background: "#0a0d18" }}>
        {children}

        {/* OneSignal SDK */}
        <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          strategy="afterInteractive"
        />

        {/* OneSignal Init + Banner notifiche */}
        <Script id="onesignal-init" strategy="afterInteractive">
          {`
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function(OneSignal) {
              await OneSignal.init({
                appId: "cb2f63d9-6736-47a6-97e7-913f41abd463",
                notifyButton: { enable: false },
                allowLocalhostAsSecureOrigin: true,
              });
              if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
                let bannerShown = false;
                function showBanner() {
                  if (bannerShown) return;
                  bannerShown = true;
                  window.removeEventListener('scroll', showBanner);
                  window.removeEventListener('touchstart', showBanner);
                  window.removeEventListener('click', showBanner);
                  const banner = document.createElement('div');
                  banner.id = 'norma-notif-banner';
                  banner.style.cssText = \`
                    position: fixed;
                    top: -100px;
                    left: 0;
                    right: 0;
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 16px;
                    background: #041428;
                    border-bottom: 1px solid rgba(143,211,255,0.2);
                    cursor: pointer;
                    transition: top 0.4s cubic-bezier(0.16,1,0.3,1);
                    font-family: 'Montserrat', sans-serif;
                  \`;
                  banner.innerHTML = \`
                    <img src="/apple-touch-icon.png" style="width:40px;height:40px;border-radius:10px;flex-shrink:0;" />
                    <div style="flex:1;min-width:0;">
                      <div style="font-size:13px;font-weight:800;color:#fff;margin-bottom:2px;">Norma</div>
                      <div style="font-size:11px;color:rgba(255,255,255,0.5);">Tocca per attivare le notifiche push</div>
                    </div>
                    <div style="font-size:10px;font-weight:700;color:#8fd3ff;letter-spacing:1px;flex-shrink:0;border:1px solid rgba(143,211,255,0.3);border-radius:20px;padding:5px 12px;">ATTIVA</div>
                  \`;
                  document.body.appendChild(banner);
                  setTimeout(() => { banner.style.top = '0px'; }, 50);
                  banner.addEventListener('click', async function() {
                    banner.style.top = '-100px';
                    setTimeout(() => { banner.remove(); }, 400);
                    await OneSignal.Notifications.requestPermission();
                  });
                  setTimeout(() => {
                    if (document.getElementById('norma-notif-banner')) {
                      banner.style.top = '-100px';
                      setTimeout(() => { banner.remove(); }, 400);
                    }
                  }, 6000);
                }
                window.addEventListener('scroll', showBanner, { passive: true });
                window.addEventListener('touchstart', showBanner, { passive: true });
                window.addEventListener('click', showBanner);
              }
            });
          `}
        </Script>

        {/* Service Worker — OneSignal + auto-aggiornamento PWA */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function () {
                navigator.serviceWorker.register('/OneSignalSDKWorker.js')
                  .then(function(reg) { console.log('OneSignal SW registrato:', reg.scope); })
                  .catch(function(err) { console.log('OneSignal SW errore:', err); });
                navigator.serviceWorker.register('/sw.js')
                  .then(function(reg) {
                    console.log('Norma SW registrato:', reg.scope);
                    reg.addEventListener('updatefound', function() {
                      const newWorker = reg.installing;
                      newWorker.addEventListener('statechange', function() {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                          newWorker.postMessage('SKIP_WAITING');
                          window.location.reload();
                        }
                      });
                    });
                  })
                  .catch(function(err) { console.log('Norma SW errore:', err); });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}