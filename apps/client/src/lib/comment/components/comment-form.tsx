import { Loader2, Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useCreateComment } from '../hooks/use-create-comment';

type Props = {
  blogId: string;
};

export const CommentForm = ({ blogId }: Props) => {
  const [content, setContent] = useState('');
  const { createComment, isLoading } = useCreateComment(blogId);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const trimmed = content.trim();
    if (!trimmed) return;

    const result = await createComment({ content: trimmed });

    if (!result.isSuccess) {
      toast.error(result.error);
      return;
    }

    setContent('');
  };

  return (
    <form onSubmit={onSubmit} className="flex items-start gap-2">
      <Input
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Escribe un comentario..."
        className="flex-1"
      />
      <Button type="submit" disabled={isLoading || !content.trim()}>
        {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
        Comentar
      </Button>
    </form>
  );
};
