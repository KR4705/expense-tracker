import { Check } from 'lucide-react';
import { CATEGORY_ICONS } from './categoryIcons.ts';
import styles from './CategoryTile.module.css';

export interface CategoryTileProps {
  /** Stable category ID; used for selection state, never the label. */
  categoryId: string;
  /** Visible label, also the accessible name (SG-22, SG-41). */
  label: string;
  /** Lucide identifier from the category icon registry (D-21). */
  icon: string;
  selected: boolean;
  /** Inactive category: shown in place but cannot be selected (SG-45). */
  disabled?: boolean;
  /** Fires with the new selected value. Not called while disabled. */
  onToggle: (selected: boolean) => void;
}

/**
 * One selectable category (design-system/components/CategoryTile.md v0.2).
 *
 * A native checkbox sits visually hidden inside the tile's <label>, so the tile
 * is a real checkbox for assistive technology (SG-25, SG-41): the label text is
 * its name, Space toggles it, and a disabled tile is announced as unavailable.
 */
export function CategoryTile({ categoryId, label, icon, selected, disabled = false, onToggle }: CategoryTileProps) {
  const Icon = CATEGORY_ICONS[icon];
  if (!Icon && import.meta.env.DEV) {
    console.error(`CategoryTile: no icon registered for "${icon}" (category "${categoryId}")`);
  }

  return (
    <label className={styles.tile} data-selected={selected || undefined} data-disabled={disabled || undefined}>
      <input
        type="checkbox"
        className={styles.input}
        checked={selected}
        disabled={disabled}
        onChange={(event) => onToggle(event.target.checked)}
        data-category-id={categoryId}
      />
      <span className={styles.plate} aria-hidden="true">
        {Icon ? <Icon className={styles.icon} aria-hidden="true" focusable="false" /> : null}
      </span>
      <span className={styles.label} data-tile-label="">
        {label}
      </span>
      {selected ? (
        <span className={styles.badge} aria-hidden="true">
          <Check className={styles.badgeIcon} aria-hidden="true" focusable="false" />
        </span>
      ) : null}
    </label>
  );
}
