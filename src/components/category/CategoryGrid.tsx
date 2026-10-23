import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import type { Category } from '../../data/categories.ts';
import { CategoryTile } from './CategoryTile.tsx';
import styles from './CategoryGrid.module.css';

export interface CategoryGridProps {
  /** Category records in any order; rendered by ascending displayOrder. */
  categories: readonly Category[];
  /** Controlled selection (0…n IDs). Zero is valid and saves as Uncategorized (SG-26). */
  selectedIds: ReadonlySet<string>;
  /** Fires with the new selection after every toggle. */
  onChange: (selectedIds: Set<string>) => void;
  /** Accessible group name; usually the ID of the page heading. */
  labelledBy?: string;
}

/**
 * The category grid (design-system/components/CategoryGrid.md v0.2).
 *
 * - Multi-select checkboxes; any number of tiles, including none (SG-25).
 * - No exclusivity: selecting Other, or any tile, never clears another (SG-26, D-15).
 * - Inactive categories are rendered disabled in their normal position (SG-45).
 * - Live summary of the selection, listed in grid order (SG-25, SG-41).
 * - 3 columns on phones, 4 above 430 px, 2 when large text would push any label
 *   beyond two lines (SG-23, SG-43).
 */
export function CategoryGrid({ categories, selectedIds, onChange, labelledBy }: CategoryGridProps) {
  const ordered = [...categories].sort((a, b) => a.displayOrder - b.displayOrder);
  const summaryId = useId();
  const gridRef = useRef<HTMLDivElement>(null);
  const largeText = useLargeTextFallback(gridRef, ordered.map((c) => c.label).join('|'));

  const toggle = (id: string, selected: boolean) => {
    const next = new Set(selectedIds);
    if (selected) next.add(id);
    else next.delete(id);
    onChange(next);
  };

  const selectedLabels = ordered.filter((c) => selectedIds.has(c.id)).map((c) => c.label);
  const summary =
    selectedLabels.length === 0
      ? 'No category selected — you can still continue'
      : `${selectedLabels.length} selected: ${selectedLabels.join(', ')}`;

  return (
    <div className={styles.root}>
      <div
        ref={gridRef}
        role="group"
        aria-labelledby={labelledBy}
        aria-describedby={summaryId}
        className={styles.grid}
        data-large-text={largeText || undefined}
      >
        {ordered.map((category) => (
          <CategoryTile
            key={category.id}
            categoryId={category.id}
            label={category.label}
            icon={category.icon}
            selected={selectedIds.has(category.id)}
            disabled={!category.active}
            onToggle={(selected) => toggle(category.id, selected)}
          />
        ))}
      </div>
      <p id={summaryId} className={styles.summary} role="status">
        {summary}
      </p>
    </div>
  );
}

/**
 * SG-43 / SG-23: switch to the large-text column count when any label would
 * exceed two lines (or overflow its tile) at the normal column count.
 * Re-measured when the grid width changes, the labels change, or web fonts load.
 */
function useLargeTextFallback(gridRef: RefObject<HTMLDivElement | null>, labelsKey: string): boolean {
  const [largeText, setLargeText] = useState(false);
  const [measureRequest, setMeasureRequest] = useState(0);
  const remeasure = useCallback(() => {
    setLargeText(false);
    setMeasureRequest((n) => n + 1);
  }, []);

  // Measure at the normal column count; fall back if any label does not fit.
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || largeText) return;
    const overflows = Array.from(grid.querySelectorAll<HTMLElement>('[data-tile-label]')).some((label) => {
      const lineHeight = parseFloat(getComputedStyle(label).lineHeight);
      const tooManyLines = lineHeight > 0 && label.getBoundingClientRect().height > lineHeight * 2 + 1;
      const tooWide = label.scrollWidth > label.clientWidth + 1;
      return tooManyLines || tooWide;
    });
    if (overflows) setLargeText(true);
  }, [gridRef, largeText, measureRequest, labelsKey]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    let width = grid.clientWidth;
    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            if (grid.clientWidth !== width) {
              width = grid.clientWidth;
              remeasure();
            }
          });
    observer?.observe(grid);
    let active = true;
    document.fonts?.ready.then(() => active && remeasure());
    return () => {
      active = false;
      observer?.disconnect();
    };
  }, [gridRef, remeasure]);

  return largeText;
}
