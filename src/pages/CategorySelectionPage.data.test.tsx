// Proves the page reads src/data/categories.json at build time: the JSON
// module is replaced with a copy whose labels and active flags differ, and the
// rendered page follows the data without any component change.
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategorySelectionPage } from './CategorySelectionPage.tsx';

vi.mock('../data/categories.json', async (importOriginal) => {
  const original = (await importOriginal<{ default: { categories: Array<Record<string, unknown>> } }>()).default;
  return {
    default: {
      ...original,
      categories: original.categories.map((c) => {
        if (c.id === 'food') return { ...c, label: 'Groceries' };
        if (c.id === 'travel') return { ...c, active: false };
        return c;
      }),
    },
  };
});

describe('CategorySelectionPage with modified dataset', () => {
  it('renders the changed label from the dataset', () => {
    render(<CategorySelectionPage />);
    expect(screen.getByRole('checkbox', { name: 'Groceries' })).toBeInTheDocument();
    expect(screen.queryByRole('checkbox', { name: 'Food' })).not.toBeInTheDocument();
  });

  it('keeps the changed category in its dataset position', () => {
    render(<CategorySelectionPage />);
    const labels = screen.getAllByRole('checkbox').map((el) => el.closest('label')?.textContent);
    expect(labels[0]).toBe('Groceries');
  });

  it('renders a category marked inactive in the dataset as disabled', async () => {
    const user = userEvent.setup();
    render(<CategorySelectionPage />);
    const travel = screen.getByRole('checkbox', { name: 'Travel' });
    expect(travel).toBeDisabled();
    await user.click(travel);
    expect(travel).not.toBeChecked();
  });
});
