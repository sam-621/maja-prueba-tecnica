import { PenLine } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ButtonLink } from '@/shared/components/ui/button-link';
import { useUser } from '@/shared/contexts/user-context';
import { BlogsSearch } from '@/lib/blog/components/blogs-search';
import { BlogsCategoryFilter } from '@/lib/blog/components/blogs-category-filter';
import { BlogFeedProvider } from '@/lib/blog/contexts/blog-feed-context';

import { ProfileBlogsList } from '../components/profile-blogs-list';

export const ProfilePage = () => {
  const { user } = useUser();

  const avatarUrl = user
    ? `https://api.dicebear.com/10.x/adventurer-neutral/svg?seed=${encodeURIComponent(user.email)}`
    : undefined;

  return (
    <BlogFeedProvider>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarImage src={avatarUrl} alt={user?.fullname} />
              <AvatarFallback>
                {user ? getInitials(user.fullname) : '?'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold">{user?.fullname}</span>
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
            </div>
          </div>

          <ButtonLink to="/new">
            <PenLine />
            Escribir
          </ButtonLink>
        </div>

        <Separator />

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Busca tus publicaciones</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <BlogsSearch />
            </div>
            <div className="sm:w-72">
              <BlogsCategoryFilter />
            </div>
          </div>
        </div>

        <ProfileBlogsList />
      </div>
    </BlogFeedProvider>
  );
};

function getInitials(fullname: string): string {
  return fullname.slice(0, 2).toUpperCase();
}
