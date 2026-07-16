import { useState } from 'react';
import { ChevronDown, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Blog } from '@/lib/api/types';
import { useUser } from '@/shared/contexts/user-context';

import { RemoveBlogAlert } from './remove-blog-alert';

type Props = {
  blog: Blog;
};

export const BlogActions = ({ blog }: Props) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  if (user?.id !== blog.authorId) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm">
              Actions
              <ChevronDown />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigate(`/blogs/${blog.id}/edit`)}>
            <Pencil />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setIsRemoveOpen(true)}
          >
            <Trash2 />
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RemoveBlogAlert
        blog={blog}
        isOpen={isRemoveOpen}
        setIsOpen={setIsRemoveOpen}
      />
    </>
  );
};
