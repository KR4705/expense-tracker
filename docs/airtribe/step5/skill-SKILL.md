---
name: "category-ambiguity-helper"
description: "Make categorization easier by helping users understand the differences between categories that could reasonably compete for the same item."
---

# Skill: Category Ambiguity Helper

## Vision

Make categorization easier by helping users understand the differences between categories that could reasonably compete for the same item.

Users should not have to guess which category is appropriate when multiple choices appear similar.

## Skill Objective

Create a simple, reusable skill that identifies potential ambiguities in logical categorization systems and provides contextual explanations through an **Info (ⓘ) button**.

The skill should work across different applications and categorization systems.

## Expected Behavior

### 1. Identify Ambiguities

Analyze the existing categories and their documented definitions.

Identify situations where:
- Two or more categories have overlapping meanings.
- An item could reasonably belong to multiple categories.
- Category boundaries are unclear.
- Users might misunderstand which category to choose.

Only flag meaningful ambiguities. Do not assume every category needs clarification.

### 2. Add Contextual Information

For categories with meaningful ambiguity:

- Add a discreet Info (ⓘ) button associated with the category tile.
- Clicking Info opens a simple modal.
- The modal explains what the category includes.
- Where relevant, explain how it differs from competing categories.
- Use concise language and verified examples.
- Provide an obvious way to close the modal.

**Example:** If "Travel" and "Transit" are separate categories, the modal could explain their differences based on the application's actual category definitions.

### 3. Preserve Existing UX

- Do not change category names, definitions, or selection behavior.
- Do not add Info buttons to categories without meaningful ambiguity.
- Reuse existing design-system styles, icons, and components.
- Keep the information button visually secondary.
- Ensure the Info button does not trigger category selection.
- Preserve accessibility, including keyboard support and modal focus behavior.
- Avoid unnecessary animations, dependencies, or additional screens.

## Skill Workflow

1. Read the category definitions and existing UI.
2. Identify clear competing choices and potential misunderstandings.
3. Explain the ambiguity and propose clarification text.
4. Identify which category tiles need Info buttons.
5. Present the proposed changes for approval.
6. Once approved, implement the Info buttons and modals.
7. Validate that the original category-selection functionality still works.

## Expected Output

The skill should provide:

- A list of meaningful category ambiguities.
- The competing categories involved.
- Suggested clarification text.
- Categories requiring Info buttons.
- Minimal UI changes needed.
- Validation results after implementation.

## Guiding Principle

**Only explain what is genuinely confusing. Keep everything else simple.**

Create the skill using these expectations. Focus on simplicity, reusability, and minimal changes to the existing interface.