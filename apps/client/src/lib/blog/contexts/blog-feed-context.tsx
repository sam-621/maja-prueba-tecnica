/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { Category } from '@/lib/api/types';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';

type BlogFeedContextSchema = {
  search: string;
  setSearch: (value: string) => void;
  debouncedSearch: string;
  selectedCategories: Category[];
  setSelectedCategories: (categories: Category[]) => void;
  categoryIds: string[];
  hasActiveFilters: boolean;
};

const BlogFeedContext = createContext<BlogFeedContextSchema | null>(null);

export const BlogFeedProvider = ({ children }: { children: ReactNode }) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const categoryIds = useMemo(
    () => selectedCategories.map((category) => category.id),
    [selectedCategories]
  );

  const value = useMemo(
    () => ({
      search,
      setSearch,
      debouncedSearch,
      selectedCategories,
      setSelectedCategories,
      categoryIds,
      hasActiveFilters: debouncedSearch.length > 0 || categoryIds.length > 0,
    }),
    [search, debouncedSearch, selectedCategories, categoryIds]
  );

  return (
    <BlogFeedContext.Provider value={value}>
      {children}
    </BlogFeedContext.Provider>
  );
};

export const useBlogFeed = () => {
  const context = useContext(BlogFeedContext);

  if (!context) {
    throw new Error('useBlogFeed must be used within a BlogFeedProvider');
  }

  return context;
};
