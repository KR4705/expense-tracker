import { useId, useState } from 'react';
import { CategoryDifferenceInfo } from '../components/category/CategoryDifferenceInfo.tsx';
import { CategoryGrid } from '../components/category/CategoryGrid.tsx';
import { getCategories, type Category } from '../data/categories.ts';
import styles from './CategorySelectionPage.module.css';

/**
 * Categories whose approved descriptions overlap: Transit is "day-to-day travel",
 * Travel is "trips away from home". See docs/airtribe/step5/ for the analysis.
 */
const AMBIGUOUS_CATEGORY_IDS = ['transport', 'travel'] as const;

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
        {/* Transit vs Travel: the one ambiguity found by the category-ambiguity-helper skill (Step 5). */}
        <CategoryDifferenceInfo categories={categories} categoryIds={AMBIGUOUS_CATEGORY_IDS} />
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
