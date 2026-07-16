/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';

type BlogFeedContextSchema = {
  search: string;
  setSearch: (value: string) => void;
  debouncedSearch: string;
};

const BlogFeedContext = createContext<BlogFeedContextSchema | null>(null);

export const BlogFeedProvider = ({ children }: { children: ReactNode }) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);

  const value = useMemo(
    () => ({ search, setSearch, debouncedSearch }),
    [search, debouncedSearch]
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
