import { AppShell } from './app/AppShell.tsx';
import { CategorySelectionPage } from './pages/CategorySelectionPage.tsx';

export function App() {
  return (
    <AppShell>
      <CategorySelectionPage />
    </AppShell>
  );
}
