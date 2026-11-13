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
    statusBarStyle: "default",
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
      { url: "/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#f2f2f7",
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
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Norma" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Su schermi larghi l'app resta in una colonna centrale, come un'app
            aperta su tablet/desktop, invece di stirarsi a tutta larghezza. */}
        <div className="app-colonna">{children}</div>

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
                // Un solo service worker per scope: OneSignal usa sw.js
                // (che importa il suo SDK) invece di registrarne uno suo.
                serviceWorkerPath: 'sw.js',
                serviceWorkerParam: { scope: '/' },
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
                    top: -160px;
                    left: 0;
                    right: 0;
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 16px;
                    background: rgba(249,249,252,0.86); backdrop-filter: saturate(180%) blur(20px); -webkit-backdrop-filter: saturate(180%) blur(20px); box-shadow: 0 8px 30px rgba(16,24,40,0.12);
                    border-bottom: 0.5px solid rgba(60,60,67,0.13); padding-top: calc(14px + env(safe-area-inset-top, 0px));
                    cursor: pointer;
                    transition: top 0.4s cubic-bezier(0.16,1,0.3,1);
                    font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
                  \`;
                  banner.innerHTML = \`
                    <img src="/apple-touch-icon.png" style="width:40px;height:40px;border-radius:10px;flex-shrink:0;" />
                    <div style="flex:1;min-width:0;">
                      <div style="font-size:13px;font-weight:800;color:#0b0b0f;margin-bottom:2px;">Norma</div>
                      <div style="font-size:11px;color:rgba(60,60,67,0.6);">Tocca per attivare le notifiche push</div>
                    </div>
                    <div style="font-size:13px;font-weight:600;color:#fff;flex-shrink:0;background:#0a66ff;border-radius:20px;padding:7px 14px;">Attiva</div>
                  \`;
                  document.body.appendChild(banner);
                  setTimeout(() => { banner.style.top = '0px'; }, 50);
                  banner.addEventListener('click', async function() {
                    banner.style.top = '-160px';
                    setTimeout(() => { banner.remove(); }, 400);
                    await OneSignal.Notifications.requestPermission();
                  });
                  setTimeout(() => {
                    if (document.getElementById('norma-notif-banner')) {
                      banner.style.top = '-160px';
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

        {/* Service Worker — OneSignal + aggiornamento PWA silenzioso (nessun banner) */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function () {
                // OneSignal registra lo stesso worker come /sw.js?appId=...&sdkVersion=...
                // Se lo registrassimo anche noi come /sw.js, per il browser
                // sarebbero due script diversi: si sostituirebbero a vicenda e
                // ogni sostituzione farebbe ricaricare la pagina, all'infinito.
                // Quindi lo registriamo solo se non ce n'è già uno.
                function gestisci(reg) {
                  // Aggiornamento silenzioso: il nuovo worker fa skipWaiting + clients.claim.
                  reg.addEventListener('updatefound', function() {
                    var nuovo = reg.installing;
                    if (!nuovo) return;
                    nuovo.addEventListener('statechange', function() {
                      if (nuovo.state === 'installed' && navigator.serviceWorker.controller) nuovo.postMessage('SKIP_WAITING');
                    });
                  });
                  // Una PWA riaperta dal multitasking non naviga: al ritorno in
                  // primo piano chiediamo noi se c'è una versione nuova.
                  document.addEventListener('visibilitychange', function() {
                    if (document.visibilityState === 'visible') reg.update().catch(function() {});
                  });
                }
                navigator.serviceWorker.getRegistration('/').then(function(esistente) {
                  if (esistente) return gestisci(esistente);
                  return navigator.serviceWorker.register('/sw.js').then(gestisci);
                }).catch(function(err) { console.log('Norma SW errore:', err); });

                // Quando un worker nuovo prende il controllo si ricarica per
                // applicarlo, ma al massimo una volta al minuto: qualunque
                // ciclo di sostituzioni non può più diventare un loop di reload.
                var avevaController = !!navigator.serviceWorker.controller;
                navigator.serviceWorker.addEventListener('controllerchange', function() {
                  if (!avevaController) return;
                  try {
                    var ultimo = Number(sessionStorage.getItem('norma_sw_reload') || 0);
                    if (Date.now() - ultimo < 60000) return;
                    sessionStorage.setItem('norma_sw_reload', String(Date.now()));
                  } catch (e) { return; }
                  window.location.reload();
                });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}