import rawCategories from './categories.json';

/**
 * A category record from src/data/categories.json.
 * The JSON file is the single source of truth; scripts/validate-categories.mjs
 * enforces its rules at build time (unique IDs, Other last, valid icons, …).
 */
export interface Category {
  /** Stable ID stored with expenses (maps to `categoryId` in the specs). */
  id: string;
  /** Visible label, 1–2 words (SG-27). */
  label: string;
  /** Lucide icon identifier from src/data/category-icons.json. */
  icon: string;
  /** Position in the grid; lower comes first. Other is always last (SG-26). */
  displayOrder: number;
  /** `false` = visible but disabled, cannot be selected (SG-45). */
  active: boolean;
  status: 'provisional' | 'approved';
  description?: string;
}

interface CategoryFile {
  categories: Category[];
}

/** ID of the catch-all category (SG-26). Non-exclusive: combines with any other. */
export const OTHER_CATEGORY_ID = 'other';

/**
 * Returns the categories in display order. Takes the parsed JSON so tests can
 * pass modified data; the app uses the bundled categories.json.
 */
export function getCategories(data: CategoryFile = rawCategories as CategoryFile): Category[] {
  return [...data.categories].sort((a, b) => a.displayOrder - b.displayOrder);
}
