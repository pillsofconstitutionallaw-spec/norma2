'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const sentenze = [
  {
    numero: '1/1956',
    titolo: 'Primato della Costituzione',
    tag: 'Fonti del diritto',
    anno: '1956',
    caso: 'La Corte affronta il problema delle leggi anteriori alla Costituzione incompatibili con i principi costituzionali.',
    motivazione: 'La Costituzione è fonte gerarchicamente superiore e anche le leggi precedenti devono conformarsi ad essa.',
  },
  {
    numero: '183/1973',
    titolo: 'Frontini',
    tag: 'Unione Europea',
    anno: '1973',
    caso: 'La Corte affronta il rapporto tra ordinamento italiano e diritto comunitario.',
    motivazione: 'L’Italia può consentire limitazioni di sovranità ai sensi dell’art. 11 Cost., ma restano fermi i principi fondamentali dell’ordinamento costituzionale.',
  },
  {
    numero: '170/1984',
    titolo: 'Granital',
    tag: 'Unione Europea',
    anno: '1984',
    caso: 'Conflitto tra una legge italiana e il diritto comunitario europeo.',
    motivazione: 'Il giudice ordinario deve disapplicare la legge interna incompatibile con il diritto europeo.',
  },
  {
    numero: '154/1985',
    titolo: 'Autonomia parlamentare',
    tag: 'Parlamento',
    anno: '1985',
    caso: 'Si discuteva sulla possibilità per la Corte costituzionale di sindacare i regolamenti parlamentari.',
    motivazione: 'La Corte afferma che i regolamenti parlamentari non sono generalmente sindacabili.',
  },
  {
    numero: '1146/1988',
    titolo: 'Controlimiti',
    tag: 'Diritto internazionale',
    anno: '1988',
    caso: 'La Corte affronta il rapporto tra diritto internazionale e principi supremi della Costituzione.',
    motivazione: 'Le norme internazionali incontrano il limite dei principi fondamentali dell’ordinamento costituzionale italiano.',
  },
  {
    numero: '203/1989',
    titolo: 'Laicità dello Stato',
    tag: 'Principi fondamentali',
    anno: '1989',
    caso: 'La Corte esamina il principio di laicità nell’ordinamento costituzionale italiano.',
    motivazione: 'La laicità costituisce un principio supremo dell’ordinamento costituzionale.',
  },
  {
    numero: '7/1996',
    titolo: 'Sfiducia individuale',
    tag: 'Governo',
    anno: '1996',
    caso: 'La vicenda riguarda la mozione di sfiducia individuale verso un singolo ministro.',
    motivazione: 'La Corte riconosce la compatibilità costituzionale della sfiducia individuale.',
  },
  {
    numero: '356/1996',
    titolo: 'Tutela dell’ambiente',
    tag: 'Ambiente',
    anno: '1996',
    caso: 'La Corte affronta il valore costituzionale della tutela ambientale.',
    motivazione: 'L’ambiente costituisce un valore primario e assoluto da proteggere.',
  },
  {
    numero: '360/1996',
    titolo: 'Decreti-legge reiterati',
    tag: 'Fonti del diritto',
    anno: '1996',
    caso: 'Il Governo reiterava decreti-legge non convertiti mantenendo in vita norme provvisorie.',
    motivazione: 'La reiterazione sistematica viola l\'art. 77 Cost. perché altera il rapporto tra Governo e Parlamento.',
  },
  {
    numero: '509/2000',
    titolo: 'Danno biologico',
    tag: 'Diritti fondamentali',
    anno: '2000',
    caso: 'La Corte affronta la tutela costituzionale della salute e del danno biologico.',
    motivazione: 'Il danno biologico è strettamente collegato alla tutela costituzionale della salute.',
  },
  {
    numero: '303/2003',
    titolo: 'Sussidiarietà Stato-Regioni',
    tag: 'Regioni',
    anno: '2003',
    caso: 'La Corte interpreta il nuovo Titolo V della Costituzione.',
    motivazione: 'Il principio di sussidiarietà consente allo Stato di intervenire in determinate materie di interesse unitario.',
  },
  {
    numero: '200/2006',
    titolo: 'Potere di grazia',
    tag: 'Presidente della Repubblica',
    anno: '2006',
    caso: 'Conflitto tra Presidente della Repubblica e Ministro della Giustizia.',
    motivazione: 'La grazia appartiene ai poteri del Presidente della Repubblica.',
  },
  {
    numero: '151/2009',
    titolo: 'Fecondazione assistita',
    tag: 'Diritti fondamentali',
    anno: '2009',
    caso: 'La Corte affronta i limiti imposti dalla legge sulla procreazione medicalmente assistita.',
    motivazione: 'La tutela della salute della donna deve prevalere su limiti irragionevoli imposti dalla legge.',
  },
  {
    numero: '199/2012',
    titolo: 'Effetti del referendum',
    tag: 'Democrazia diretta',
    anno: '2012',
    caso: 'Ripristino di una disciplina sostanzialmente abrogata tramite referendum.',
    motivazione: 'La Corte tutela l\'effettività del referendum abrogativo.',
  },
  {
    numero: '278/2013',
    titolo: 'Diritto alle origini',
    tag: 'Diritti fondamentali',
    anno: '2013',
    caso: 'La Corte affronta il diritto del figlio nato anonimamente a conoscere le proprie origini.',
    motivazione: 'Occorre bilanciare il diritto all’identità personale con la tutela della madre che ha scelto l’anonimato.',
  },
  {
    numero: '1/2014',
    titolo: 'Porcellum',
    tag: 'Legge elettorale',
    anno: '2014',
    caso: 'La Corte esamina premio di maggioranza e liste bloccate.',
    motivazione: 'Violazione della rappresentatività e dell\'eguaglianza del voto.',
  },
  {
    numero: '162/2014',
    titolo: 'Fecondazione eterologa',
    tag: 'Diritti fondamentali',
    anno: '2014',
    caso: 'Divieto assoluto di fecondazione eterologa previsto dalla legge italiana.',
    motivazione: 'Il divieto assoluto viola i diritti fondamentali della persona e l’autodeterminazione della coppia.',
  },
  {
    numero: '238/2014',
    titolo: 'Controlimiti e immunità Germania',
    tag: 'Diritto internazionale',
    anno: '2014',
    caso: 'La Corte rifiuta di dare piena esecuzione alla sentenza della Corte internazionale di giustizia del 2012 sulle immunità giurisdizionali della Germania per i crimini nazisti commessi in Italia.',
    motivazione: 'L\'immunità assoluta dello Stato straniero sacrificherebbe diritti fondamentali garantiti dalla Costituzione italiana, in particolare il diritto di accesso al giudice per le vittime dei crimini nazisti. La Corte applica la teoria dei controlimiti: i principi fondamentali della Costituzione italiana prevalgono sul diritto internazionale consuetudinario.',
  },
  {
    numero: '10/2015',
    titolo: 'Robin Tax',
    tag: 'Tributi',
    anno: '2015',
    caso: 'La Corte valuta la legittimità della cosiddetta Robin Tax.',
    motivazione: 'La Corte dichiara l’illegittimità della norma limitando nel tempo gli effetti della decisione.',
  },
  {
    numero: '275/2016',
    titolo: 'Diritti sociali e bilancio',
    tag: 'Diritti fondamentali',
    anno: '2016',
    caso: 'Prestazioni per persone con disabilità limitate da vincoli finanziari.',
    motivazione: 'I diritti incomprimibili non possono essere sacrificati per esigenze di bilancio.',
  },
  {
    numero: '35/2017',
    titolo: 'Italicum',
    tag: 'Legge elettorale',
    anno: '2017',
    caso: 'Controllo della legge elettorale Italicum.',
    motivazione: 'La Corte elimina il premio di maggioranza sproporzionato.',
  },
  {
    numero: '17/2019',
    titolo: 'Maxiemendamento e fiducia',
    tag: 'Parlamento',
    anno: '2019',
    caso: 'Compressione del dibattito parlamentare durante la legge di bilancio.',
    motivazione: 'La Corte riconosce ampia autonomia interna delle Camere.',
  },
  {
    numero: '242/2019',
    titolo: 'Caso Cappato',
    tag: 'Diritti fondamentali',
    anno: '2019',
    caso: 'La Corte affronta il tema del suicidio medicalmente assistito.',
    motivazione: 'In presenza di specifiche condizioni, non è punibile chi agevola l’esecuzione del proposito di suicidio di una persona malata e consapevole.',
  },
  {
    numero: '32/2020',
    titolo: 'Ergastolo ostativo',
    tag: 'Diritti fondamentali',
    anno: '2020',
    caso: 'La Corte esamina il regime dell’ergastolo ostativo.',
    motivazione: 'La funzione rieducativa della pena impone una valutazione individuale del percorso del detenuto.',
  },
  {
    numero: '192/2024',
    titolo: 'Autonomia differenziata',
    tag: 'Regioni',
    anno: '2024',
    caso: 'Questioni sulla legge relativa all\'autonomia differenziata.',
    motivazione: 'La Corte dichiara illegittime varie disposizioni della legge.',
  },
  {
    numero: '10/2025',
    titolo: 'Referendum autonomia',
    tag: 'Democrazia diretta',
    anno: '2025',
    caso: 'Verifica di ammissibilità del referendum sulla legge 86/2024.',
    motivazione: 'Il referendum viene dichiarato inammissibile.',
  },
];

export default function SentenzePage() {
  const [attiva, setAttiva] = useState<number | null>(null);

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0d18; }
        ::-webkit-scrollbar { display: none; }
        html, body { overflow-x: hidden; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ fontFamily: 'Montserrat, sans-serif', background: '#0a0d18', minHeight: '100vh' }}>
        <Header />

        {/* HERO */}
        <div style={{ padding: '32px 16px 24px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 10 }}>
            Corte Costituzionale
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: -1, marginBottom: 10 }}>
            Sentenze<br />fondamentali
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, maxWidth: 320 }}>
            Le decisioni che hanno scritto la storia della Repubblica e definito i confini del potere.
          </div>
        </div>

        {/* LISTA SENTENZE */}
        <div style={{ padding: '0 16px 140px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sentenze.map((s, i) => {
            const aperta = attiva === i;
            return (
              <div
                key={i}
                onClick={() => setAttiva(aperta ? null : i)}
                style={{
                  background: aperta ? '#111a30' : '#0f1424',
                  border: `0.5px solid ${aperta ? 'rgba(143,211,255,0.25)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 20,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >
                {/* HEADER CARD */}
                <div style={{ padding: '18px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  {/* Numero */}
                  <div style={{
                    flexShrink: 0,
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: aperta ? 'rgba(143,211,255,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `0.5px solid ${aperta ? 'rgba(143,211,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 1,
                  }}>
                    <div style={{ fontSize: 7, fontWeight: 700, color: aperta ? '#8fd3ff' : 'rgba(255,255,255,0.3)', letterSpacing: 0.5 }}>SENT.</div>
                    <div style={{ fontSize: 11, fontWeight: 900, color: aperta ? '#8fd3ff' : 'rgba(255,255,255,0.5)', lineHeight: 1 }}>{s.anno}</div>
                  </div>

                  {/* Testo */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1.5, color: aperta ? '#8fd3ff' : 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: 4 }}>
                      {s.tag}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: 1.25 }}>
                      {s.titolo}
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>
                      n. {s.numero}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    border: '0.5px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: aperta ? 'rotate(90deg)' : 'none',
                    transition: 'transform 0.25s ease',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </div>
                </div>

                {/* ESPANSIONE */}
                {aperta && (
                  <div style={{
                    padding: '0 18px 20px',
                    animation: 'fadeIn 0.2s ease',
                  }}>
                    <div style={{
                      borderTop: '0.5px solid rgba(255,255,255,0.06)',
                      paddingTop: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 14,
                    }}>
                      {/* Caso */}
                      <div>
                        <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: 'rgba(143,211,255,0.5)', textTransform: 'uppercase', marginBottom: 6 }}>
                          Il caso
                        </div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                          {s.caso}
                        </div>
                      </div>

                      {/* Motivazione */}
                      <div style={{
                        background: 'rgba(143,211,255,0.05)',
                        border: '0.5px solid rgba(143,211,255,0.12)',
                        borderRadius: 12,
                        padding: '12px 14px',
                      }}>
                        <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: '#8fd3ff', textTransform: 'uppercase', marginBottom: 6 }}>
                          Principio
                        </div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
                          {s.motivazione}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </>
  );
}
