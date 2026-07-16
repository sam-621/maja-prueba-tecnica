import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Blog } from '@/lib/api/types';
import { useDeleteBlog } from '@/lib/blog/hooks/use-delete-blog';

type Props = {
  blog: Blog;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const RemoveBlogAlert = ({ blog, isOpen, setIsOpen }: Props) => {
  const navigate = useNavigate();
  const { deleteBlog, isLoading } = useDeleteBlog();

  const onConfirm = async () => {
    const result = await deleteBlog(blog.id);

    if (!result.isSuccess) {
      toast.error(result.error);
      return;
    }

    setIsOpen(false);
    toast.success('Post removed');
    navigate('/');
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove "{blog.title}"</AlertDialogTitle>
          <AlertDialogDescription>
            This post will be permanently deleted. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isLoading}
            onClick={onConfirm}
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
