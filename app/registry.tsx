'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { StyleRegistry, createStyleRegistry } from 'styled-jsx';

// Molte pagine usano <style jsx global>. Senza questo registro quegli stili
// venivano applicati solo nel browser, dopo il caricamento: la pagina
// compariva per un istante senza margini né stile. Così arrivano già
// nell'HTML del server (guida Next.js "CSS-in-JS", sezione styled-jsx).
export default function StyledJsxRegistry({ children }: { children: React.ReactNode }) {
  const [registro] = useState(() => createStyleRegistry());

  useServerInsertedHTML(() => {
    const stili = registro.styles();
    registro.flush();
    return <>{stili}</>;
  });

  return <StyleRegistry registry={registro}>{children}</StyleRegistry>;
}
