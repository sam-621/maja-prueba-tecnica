import { useState } from 'react';

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/shared/components/ui/combobox';
import type { Category } from '@/lib/api/types';
import { useCategories } from '@/lib/category/hooks/use-categories';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';

import { useBlogFeed } from '../contexts/blog-feed-context';

const VISIBLE_CATEGORIES = 5;

export const BlogsCategoryFilter = () => {
  const { selectedCategories, setSelectedCategories } = useBlogFeed();
  const [query, setQuery] = useState('');
  const anchor = useComboboxAnchor();

  const debouncedQuery = useDebouncedValue(query.trim(), 300);

  // Only the first N categories are shown by default; the rest surface as the
  // user types, since the search is resolved server-side.
  const { data } = useCategories({
    search: debouncedQuery || undefined,
    size: VISIBLE_CATEGORIES,
  });
  const categories = data?.categories ?? [];

  return (
    <Combobox
      multiple
      value={selectedCategories}
      onValueChange={(next) => {
        setSelectedCategories(next as Category[]);
        setQuery('');
      }}
      inputValue={query}
      onInputValueChange={setQuery}
      itemToStringLabel={(category: Category) => category.name}
      isItemEqualToValue={(a: Category, b: Category) => a.id === b.id}
    >
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(selected: Category[]) =>
            selected.map((category) => (
              <ComboboxChip key={category.id} aria-label={category.name}>
                {category.name}
              </ComboboxChip>
            ))
          }
        </ComboboxValue>
        <ComboboxChipsInput
          placeholder={
            selectedCategories.length ? '' : 'Filtrar por categorías...'
          }
        />
      </ComboboxChips>

      <ComboboxContent anchor={anchor}>
        <ComboboxList>
          {categories.map((category) => (
            <ComboboxItem key={category.id} value={category}>
              {category.name}
            </ComboboxItem>
          ))}
        </ComboboxList>

        {!categories.length && (
          <div className="py-2 text-center text-sm text-muted-foreground">
            No se encontraron categorías.
          </div>
        )}
      </ComboboxContent>
    </Combobox>
  );
};
