import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Inter (SIL Open Font License 1.1) — see public/licenses/Inter-OFL.txt.
// Only the weights in tokens.json font.weight (400, 500, 600) and the latin +
// latin-ext subsets are loaded; latin-ext carries the ₹ glyph (U+20B9).
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-ext-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-ext-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-ext-600.css';

// Generated from design-system/tokens.json by `npm run tokens`.
import './styles/tokens.css';
import './styles/base.css';

import { App } from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root not found');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
