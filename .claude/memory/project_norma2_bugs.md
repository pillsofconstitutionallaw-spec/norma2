---
name: norma2-bugs-fixed
description: Bug fixes applied to the Norma2 legal app (stories, codici, notifiche, cron)
metadata:
  type: project
---

Bug fixes applied 2026-06-02:

- **Stories preloading**: rimosso setTimeout da 1500ms in home; aggiunta storyCache + preloading in articoli/page.tsx (mancava del tutto)
- **CodiceViewer duplicate IDs**: `aperto` state ora usa l'indice dell'array (`number`) invece di `String(a.numero)` — il codice ambiente aveva 5+ articoli con numero 3, tutti si aprivano insieme
- **Procedura penale "Art. Art."**: aggiunto helper `cleanNumero()` che stripa il prefisso "Art." dal campo numero (il file .ts li aveva già con prefisso)
- **Notifiche mostra solo "Norma"**: aggiunto fallback `en` a headings/contents in `/api/notifica`; banner layout.tsx cambiato da "Norma" a "Orizzonte Giuridico"
- **controlla-sentenze non funzionava**: `app_id: process.env.ONESIGNAL_APP_ID` era undefined (env non impostata); solo handler POST ma Vercel crons mandano GET → aggiunto GET handler
- **Nuovo endpoint `/api/controlla-instagram`**: controlla ogni ora nuovi post IG via Graph API, salva in Edge Config, manda notifica OneSignal
- **vercel.json** creato con crons: sentenze ogni giorno alle 9, instagram ogni ora

**Why:** `ONESIGNAL_APP_ID` env var non era mai stata impostata → usare sempre l'ID hardcoded `cb2f63d9-6736-47a6-97e7-913f41abd463`
**How to apply:** Qualsiasi nuovo endpoint OneSignal deve usare l'ID hardcoded, non una env var.
