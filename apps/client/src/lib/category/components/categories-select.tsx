import { Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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
import { cn } from '@/shared/utils/utils';

import { useCategories } from '../hooks/use-categories';
import { useCreateCategory } from '../hooks/use-create-category';

type Props = {
  value: Category[];
  onChange: (categories: Category[]) => void;
  id?: string;
  invalid?: boolean;
};

export const CategoriesSelect = ({ value, onChange, id, invalid }: Props) => {
  const [query, setQuery] = useState('');
  const anchor = useComboboxAnchor();

  const { data } = useCategories({ size: 100 });
  const { createCategory, isLoading: isCreating } = useCreateCategory();

  const categories = data?.categories ?? [];
  const trimmedQuery = query.trim();

  const filtered = trimmedQuery
    ? categories.filter((category) =>
        category.name.toLowerCase().includes(trimmedQuery.toLowerCase())
      )
    : categories;

  const hasExactMatch = categories.some(
    (category) => category.name.toLowerCase() === trimmedQuery.toLowerCase()
  );

  const canCreate = trimmedQuery.length > 0 && !hasExactMatch;

  const handleCreate = async () => {
    const result = await createCategory(trimmedQuery);

    if (!result.isSuccess) {
      toast.error(result.error);
      return;
    }

    onChange([...value, result.category]);
    setQuery('');
  };

  return (
    <Combobox
      multiple
      value={value}
      onValueChange={(next) => {
        onChange(next as Category[]);
        setQuery('');
      }}
      inputValue={query}
      onInputValueChange={setQuery}
      itemToStringLabel={(category: Category) => category.name}
      isItemEqualToValue={(a: Category, b: Category) => a.id === b.id}
    >
      <ComboboxChips ref={anchor} aria-invalid={invalid}>
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
          id={id}
          placeholder={value.length ? '' : 'Selecciona o crea categorías...'}
        />
      </ComboboxChips>

      <ComboboxContent anchor={anchor}>
        <ComboboxList>
          {filtered.map((category) => (
            <ComboboxItem key={category.id} value={category}>
              {category.name}
            </ComboboxItem>
          ))}
        </ComboboxList>

        {canCreate && (
          <button
            type="button"
            disabled={isCreating}
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleCreate}
            className={cn(
              'flex w-full cursor-default items-center gap-2 rounded-md p-1.5 text-sm outline-hidden',
              'hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50',
              filtered.length > 0 && 'mt-1 border-t border-border pt-1.5'
            )}
          >
            {isCreating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            <span className="truncate">Crear &ldquo;{trimmedQuery}&rdquo;</span>
          </button>
        )}

        {!filtered.length && !canCreate && (
          <div className="py-2 text-center text-sm text-muted-foreground">
            No se encontraron categorías.
          </div>
        )}
      </ComboboxContent>
    </Combobox>
  );
};
