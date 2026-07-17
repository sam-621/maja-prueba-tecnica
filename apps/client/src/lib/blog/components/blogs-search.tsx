import { Search } from 'lucide-react';

import { Input } from '@/shared/components/ui/input';

import { useBlogFeed } from '../contexts/blog-feed-context';

export const BlogsSearch = () => {
  const { search, setSearch } = useBlogFeed();

  return (
    <div className="relative">
      <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar publicaciones por título..."
        className="pl-8"
      />
    </div>
  );
};
