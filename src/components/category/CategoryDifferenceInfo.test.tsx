// Airtribe Step 5 — Info (ⓘ) for the Transit vs Travel ambiguity found by the
// category-ambiguity-helper skill. Tests the real page with the real dataset.
import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategorySelectionPage } from '../../pages/CategorySelectionPage.tsx';
import { getCategories } from '../../data/categories.ts';
import { CategoryDifferenceInfo } from './CategoryDifferenceInfo.tsx';

const INFO_NAME = 'Transit or Travel? How they differ';

function description(id: string): string {
  const category = getCategories().find((c) => c.id === id);
  if (!category?.description) throw new Error(`no description for ${id}`);
  return category.description;
}

describe('CategoryDifferenceInfo', () => {
  it('shows one Info button, outside every category tile', () => {
    render(<CategorySelectionPage />);
    const info = screen.getByRole('button', { name: INFO_NAME });
    expect(screen.getAllByRole('button', { name: /How they differ/ })).toHaveLength(1);
    expect(info.closest('label')).toBeNull();
    expect(screen.getByRole('group')).not.toContainElement(info);
  });

  it('leaves the category tiles unchanged: same count, names and no extra controls inside', () => {
    render(<CategorySelectionPage />);
    const names = screen.getAllByRole('checkbox').map((el) => el.getAttribute('data-category-id'));
    expect(names).toEqual(getCategories().map((c) => c.id));
    expect(within(screen.getByRole('group')).queryAllByRole('button')).toHaveLength(0);
  });

  it('opens a modal that explains both categories from their approved descriptions', async () => {
    const user = userEvent.setup();
    render(<CategorySelectionPage />);
    await user.click(screen.getByRole('button', { name: INFO_NAME }));

    const dialog = screen.getByRole('dialog', { name: 'Transit or Travel?' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(within(dialog).getByText(description('transport'))).toBeInTheDocument();
    expect(within(dialog).getByText(description('travel'))).toBeInTheDocument();
    expect(within(dialog).getByText(/choose both, or neither/)).toBeInTheDocument();
  });

  it('does not select or deselect any category when Info is used', async () => {
    const user = userEvent.setup();
    render(<CategorySelectionPage />);
    const transit = screen.getByRole('checkbox', { name: 'Transit' });
    const travel = screen.getByRole('checkbox', { name: 'Travel' });
    await user.click(travel);

    await user.click(screen.getByRole('button', { name: INFO_NAME }));
    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(transit).not.toBeChecked();
    expect(travel).toBeChecked();
    expect(screen.getByRole('status')).toHaveTextContent('1 selected: Travel');
  });

  it('keeps multi-select working with Transit and Travel together', async () => {
    const user = userEvent.setup();
    render(<CategorySelectionPage />);
    await user.click(screen.getByRole('checkbox', { name: 'Transit' }));
    await user.click(screen.getByRole('checkbox', { name: 'Travel' }));
    expect(screen.getByRole('status')).toHaveTextContent('2 selected: Transit, Travel');
  });

  it('moves focus into the modal, keeps Tab inside, and returns focus on Close', async () => {
    const user = userEvent.setup();
    render(<CategorySelectionPage />);
    const info = screen.getByRole('button', { name: INFO_NAME });
    await user.click(info);

    const close = screen.getByRole('button', { name: 'Close' });
    expect(close).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab({ shift: true });
    expect(close).toHaveFocus();

    await user.click(close);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(info).toHaveFocus();
  });

  it('opens with Enter and closes with Escape, returning focus to Info', async () => {
    const user = userEvent.setup();
    render(<CategorySelectionPage />);
    const info = screen.getByRole('button', { name: INFO_NAME });
    info.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(info).toHaveFocus();
  });

  it('closes when the backdrop is clicked, but not when the panel is clicked', async () => {
    const user = userEvent.setup();
    render(<CategorySelectionPage />);
    await user.click(screen.getByRole('button', { name: INFO_NAME }));
    const dialog = screen.getByRole('dialog');
    await user.click(dialog);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(dialog.parentElement as HTMLElement);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders nothing when a competing category is missing from the data', () => {
    const { container } = render(
      <CategoryDifferenceInfo categories={getCategories().filter((c) => c.id !== 'travel')} categoryIds={['transport', 'travel']} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
