import type { ReactNode } from 'react';
import styles from './AppShell.module.css';

interface AppShellProps {
  children: ReactNode;
}

/**
 * Mobile-first frame for every screen (SG-39): single column, 16 px gutters,
 * centred with a 480 px maximum width on wider screens, padded for device
 * safe areas (notch, home indicator, gesture bar).
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
