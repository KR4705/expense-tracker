import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';
import type { Category } from '../../data/categories.ts';
import { CATEGORY_ICONS } from './categoryIcons.ts';
import styles from './CategoryDifferenceInfo.module.css';

export interface CategoryDifferenceInfoProps {
  /** Full category list; the explanation is built from these records' own descriptions. */
  categories: readonly Category[];
  /** IDs of the categories that compete for the same expenses, e.g. ['transport', 'travel']. */
  categoryIds: readonly string[];
}

/**
 * Info (ⓘ) control that explains how two or more competing categories differ.
 *
 * Placement (Airtribe Step 5, category-ambiguity-helper skill): the control sits
 * next to the grid, not inside a tile. An in-tile button would break SG-17
 * (48 × 48 px target, 8 px from other targets) and SG-21 (identical tiles), so
 * CategoryTile is unchanged and opening the modal never toggles a category.
 *
 * Content comes only from each category's approved `description` in
 * src/data/categories.json, plus the product's multi-tag rule (Vision §4.5,
 * SG-25, SG-26). No classification rules are added here.
 */
export function CategoryDifferenceInfo({ categories, categoryIds }: CategoryDifferenceInfoProps) {
  const competing = categoryIds
    .map((id) => categories.find((c) => c.id === id))
    .filter((c): c is Category => c !== undefined);

  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const bodyId = useId();

  // Needs at least two competing categories, each with a description to explain.
  if (competing.length < 2 || competing.some((c) => !c.description)) return null;

  const title = `${competing.map((c) => c.label).join(' or ')}?`;

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className={styles.row}>
      <span className={styles.prompt} aria-hidden="true">
        {title}
      </span>
      <button
        ref={triggerRef}
        type="button"
        className={styles.iconButton}
        aria-label={`${title} How they differ`}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <Info className={styles.infoIcon} aria-hidden="true" focusable="false" />
      </button>
      {open
        ? createPortal(
            <InfoModal titleId={titleId} bodyId={bodyId} title={title} competing={competing} onClose={close} />,
            document.body,
          )
        : null}
    </div>
  );
}

interface InfoModalProps {
  titleId: string;
  bodyId: string;
  title: string;
  competing: Category[];
  onClose: () => void;
}

function InfoModal({ titleId, bodyId, title, competing, onClose }: InfoModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Move focus into the dialog when it opens.
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Escape closes; Tab and Shift+Tab stay inside the dialog.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== 'Tab' || !dialogRef.current) return;
    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        className={styles.dialog}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <div id={bodyId} className={styles.body}>
          <ul className={styles.list}>
            {competing.map((category) => {
              const Icon = CATEGORY_ICONS[category.icon];
              return (
                <li key={category.id} className={styles.item}>
                  <span className={styles.plate} aria-hidden="true">
                    {Icon ? <Icon className={styles.itemIcon} aria-hidden="true" focusable="false" /> : null}
                  </span>
                  <span className={styles.itemText}>
                    <span className={styles.itemLabel}>{category.label}</span>
                    <span className={styles.itemDescription}>{category.description}</span>
                  </span>
                </li>
              );
            })}
          </ul>
          <p className={styles.note}>Not sure? You can choose both, or neither — categories can overlap.</p>
        </div>
        <button ref={closeRef} type="button" className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
