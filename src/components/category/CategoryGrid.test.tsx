import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import rawCategories from '../../data/categories.json';
import iconRegistry from '../../data/category-icons.json';
import { getCategories, type Category } from '../../data/categories.ts';
import { CategorySelectionPage } from '../../pages/CategorySelectionPage.tsx';
import { CategoryGrid } from './CategoryGrid.tsx';
import { CATEGORY_ICONS } from './categoryIcons.ts';

/** Labels from the JSON file, in displayOrder — the expected render order. */
const datasetLabels = [...rawCategories.categories]
  .sort((a, b) => a.displayOrder - b.displayOrder)
  .map((c) => c.label);

const checkboxLabels = () => screen.getAllByRole('checkbox').map((el) => el.closest('label')?.textContent);
const summary = () => screen.getByRole('status');

/** Grid with real state, for tests that pass custom category data. */
function StatefulGrid({ categories, onChange }: { categories: Category[]; onChange?: (ids: Set<string>) => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  return (
    <CategoryGrid
      categories={categories}
      selectedIds={selected}
      onChange={(ids) => {
        onChange?.(ids);
        setSelected(ids);
      }}
    />
  );
}

describe('rendering from src/data/categories.json', () => {
  it('renders one checkbox tile per category in the JSON file', () => {
    render(<CategorySelectionPage />);
    expect(screen.getAllByRole('checkbox')).toHaveLength(rawCategories.categories.length);
    for (const label of datasetLabels) {
      expect(screen.getByRole('checkbox', { name: label })).toBeInTheDocument();
    }
  });

  it('renders the nine approved categories', () => {
    render(<CategorySelectionPage />);
    expect(checkboxLabels()).toEqual(['Food', 'Home', 'Shop', 'Transit', 'Health', 'Fun', 'Travel', 'Charity', 'Other']);
  });

  it('shows the page heading and a labelled group', () => {
    render(<CategorySelectionPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Choose categories' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /Choose categories/ })).toBeInTheDocument();
  });

  it('renders a Lucide icon in every tile, and every registry icon has a component', () => {
    render(<CategorySelectionPage />);
    for (const checkbox of screen.getAllByRole('checkbox')) {
      const icon = checkbox.closest('label')?.querySelector('svg');
      expect(icon).not.toBeNull();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    }
    for (const { id } of iconRegistry.icons) {
      expect(CATEGORY_ICONS[id], `missing component for icon "${id}"`).toBeDefined();
    }
  });
});

describe('ordering', () => {
  it('matches the dataset displayOrder', () => {
    render(<CategorySelectionPage />);
    expect(checkboxLabels()).toEqual(datasetLabels);
  });

  it('sorts by displayOrder even when the input is shuffled', () => {
    const shuffled = [...getCategories()].reverse();
    render(<StatefulGrid categories={shuffled} />);
    expect(checkboxLabels()).toEqual(datasetLabels);
  });

  it('keeps Other as the last tile', () => {
    render(<CategorySelectionPage />);
    expect(checkboxLabels().at(-1)).toBe('Other');
  });
});

describe('selection', () => {
  it('starts with zero selections, which is valid', () => {
    render(<CategorySelectionPage />);
    expect(screen.getAllByRole('checkbox').every((el) => !(el as HTMLInputElement).checked)).toBe(true);
    expect(summary()).toHaveTextContent('No category selected — you can still continue');
  });

  it('selects and deselects a category', async () => {
    const user = userEvent.setup();
    render(<CategorySelectionPage />);
    const food = screen.getByRole('checkbox', { name: 'Food' });

    await user.click(food);
    expect(food).toBeChecked();
    expect(summary()).toHaveTextContent('1 selected: Food');

    await user.click(food);
    expect(food).not.toBeChecked();
    expect(summary()).toHaveTextContent('No category selected');
  });

  it('allows several categories at once, summarised in grid order', async () => {
    const user = userEvent.setup();
    render(<CategorySelectionPage />);
    await user.click(screen.getByRole('checkbox', { name: 'Travel' }));
    await user.click(screen.getByRole('checkbox', { name: 'Food' }));
    await user.click(screen.getByRole('checkbox', { name: 'Home' }));

    for (const name of ['Food', 'Home', 'Travel']) {
      expect(screen.getByRole('checkbox', { name })).toBeChecked();
    }
    expect(summary()).toHaveTextContent('3 selected: Food, Home, Travel');
  });

  it('toggles with the keyboard (Space)', async () => {
    const user = userEvent.setup();
    render(<CategorySelectionPage />);
    const shop = screen.getByRole('checkbox', { name: 'Shop' });
    shop.focus();
    await user.keyboard(' ');
    expect(shop).toBeChecked();
  });

  it('marks selected tiles with a check badge', async () => {
    const user = userEvent.setup();
    render(<CategorySelectionPage />);
    const tile = screen.getByRole('checkbox', { name: 'Health' }).closest('label')!;
    expect(tile).not.toHaveAttribute('data-selected');
    await user.click(within(tile).getByRole('checkbox'));
    expect(tile).toHaveAttribute('data-selected');
    expect(tile.querySelectorAll('svg')).toHaveLength(2); // category icon + check badge
  });
});

describe('Other behaves like a normal category', () => {
  it('can be selected alongside other categories without clearing them', async () => {
    const user = userEvent.setup();
    render(<CategorySelectionPage />);
    await user.click(screen.getByRole('checkbox', { name: 'Food' }));
    await user.click(screen.getByRole('checkbox', { name: 'Charity' }));
    await user.click(screen.getByRole('checkbox', { name: 'Other' }));

    for (const name of ['Food', 'Charity', 'Other']) {
      expect(screen.getByRole('checkbox', { name })).toBeChecked();
    }
    expect(summary()).toHaveTextContent('3 selected: Food, Charity, Other');
  });

  it('stays selected when another category is chosen, and deselects on its own', async () => {
    const user = userEvent.setup();
    render(<CategorySelectionPage />);
    const other = screen.getByRole('checkbox', { name: 'Other' });
    await user.click(other);
    await user.click(screen.getByRole('checkbox', { name: 'Shop' }));
    expect(other).toBeChecked();

    await user.click(other);
    expect(other).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Shop' })).toBeChecked();
  });

  it('uses the same tile markup as every other category', () => {
    render(<CategorySelectionPage />);
    const tileClass = (name: string) => screen.getByRole('checkbox', { name }).closest('label')?.className;
    expect(tileClass('Other')).toBe(tileClass('Food'));
  });
});

describe('inactive categories (SG-45)', () => {
  const withInactiveCharity = getCategories().map((c) => (c.id === 'charity' ? { ...c, active: false } : c));

  it('stay visible, in their normal position, but disabled', () => {
    render(<StatefulGrid categories={withInactiveCharity} />);
    const charity = screen.getByRole('checkbox', { name: 'Charity' });
    expect(charity).toBeVisible();
    expect(charity).toBeDisabled();
    expect(checkboxLabels()).toEqual(datasetLabels);
  });

  it('cannot be selected by click or keyboard', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<StatefulGrid categories={withInactiveCharity} onChange={onChange} />);
    const charity = screen.getByRole('checkbox', { name: 'Charity' });

    await user.click(charity);
    await user.click(charity.closest('label')!);
    charity.focus();
    await user.keyboard(' ');

    expect(charity).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('do not block selecting other categories', async () => {
    const user = userEvent.setup();
    render(<StatefulGrid categories={withInactiveCharity} />);
    await user.click(screen.getByRole('checkbox', { name: 'Food' }));
    expect(screen.getByRole('checkbox', { name: 'Food' })).toBeChecked();
  });
});
