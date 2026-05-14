'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TEMPO = 60;
const TOTALE = 30;

const nomiMaterie: Record<string, string> = {
  'costituzionale': 'Diritto Costituzionale',
  'civile': 'Diritto Civile',
  'penale': 'Diritto Penale',
  'amministrativo': 'Diritto Amministrativo',
  'lavoro': 'Diritto del Lavoro',
  'commerciale': 'Diritto Commerciale',
  'europeo': "Diritto dell'Unione Europea",
  'processuale-civile': 'Diritto Processuale Civile',
  'processuale-penale': 'Diritto Processuale Penale',
  'internazionale': 'Diritto Internazionale',
  'romano': 'Istituzioni di Diritto Romano',
  'filosofia': 'Filosofia del Diritto',
};

export default function TestMateriaPage() {
  const params = useParams();
  const router = useRouter();
  const materia = params?.materia as string;
  const nomeMateria = nomiMaterie[materia] || materia;
  return (
    <div style={{ minHeight: '100vh', background: '#050816', color: '#fff', fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div>Pagina test: {nomeMateria}</div>
    </div>
  );
}
