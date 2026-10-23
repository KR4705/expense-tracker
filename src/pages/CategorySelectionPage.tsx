import { useId, useState } from 'react';
import { CategoryGrid } from '../components/category/CategoryGrid.tsx';
import { getCategories, type Category } from '../data/categories.ts';
import styles from './CategorySelectionPage.module.css';

interface CategorySelectionPageProps {
  /** Defaults to the bundled src/data/categories.json. */
  categories?: readonly Category[];
}

/**
 * Standalone category-selection page. It is the body of the future Categories
 * step (Step 2), built ahead of the rest of the expense-entry flow, so it has
 * no progress indicator or primary button yet.
 */
export function CategorySelectionPage({ categories = getCategories() }: CategorySelectionPageProps) {
  const headingId = useId();
  const helperId = useId();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  return (
    <section className={styles.page} aria-labelledby={headingId}>
      <header className={styles.header}>
        <h1 id={headingId} className={styles.heading}>
          Choose categories
        </h1>
        <p id={helperId} className={styles.helper}>
          Choose any that fit — or skip
        </p>
      </header>
      <CategoryGrid
        categories={categories}
        selectedIds={selectedIds}
        onChange={setSelectedIds}
        labelledBy={`${headingId} ${helperId}`}
      />
    </section>
  );
}
