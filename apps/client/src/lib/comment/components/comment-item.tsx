import { MoreHorizontal, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Comment } from '@/lib/api/types';
import { useUser } from '@/shared/contexts/user-context';

import { useDeleteComment } from '../hooks/use-delete-comment';

type Props = {
  comment: Comment;
  blogId: string;
};

export const CommentItem = ({ comment, blogId }: Props) => {
  const { user } = useUser();
  const { deleteComment, isLoading } = useDeleteComment(blogId);

  const authorName = comment.author?.fullname ?? 'Usuario';
  const seed = comment.author?.email ?? comment.authorId;
  const avatarUrl = `https://api.dicebear.com/10.x/adventurer-neutral/svg?seed=${encodeURIComponent(seed)}`;
  const isOwn = user?.id === comment.authorId;

  const onDelete = async () => {
    const result = await deleteComment(comment.id);

    if (!result.isSuccess) {
      toast.error(result.error);
      return;
    }

    toast.success('Comentario eliminado');
  };

  return (
    <div className="flex gap-3">
      <Avatar className="mt-0.5">
        <AvatarImage src={avatarUrl} alt={authorName} />
        <AvatarFallback>{getInitials(authorName)}</AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-sm font-medium">{authorName}</span>
        <p className="text-sm whitespace-pre-wrap text-foreground/90">
          {comment.content}
        </p>
      </div>

      {isOwn && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 text-muted-foreground"
                aria-label="Opciones del comentario"
              >
                <MoreHorizontal />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              variant="destructive"
              disabled={isLoading}
              onClick={onDelete}
            >
              <Trash2 />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

function getInitials(fullname: string): string {
  return fullname.slice(0, 2).toUpperCase();
}
