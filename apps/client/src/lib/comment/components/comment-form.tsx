import { Loader2, Send } from 'lucide-react';
import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit(event);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex items-start gap-2">
      <Textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        onKeyDown={onKeyDown}
        rows={1}
        placeholder="Escribe un comentario... soporta markdown"
        className="min-h-0 flex-1 resize-none"
      />
      <Button type="submit" size={'lg'} disabled={isLoading || !content.trim()}>
        {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
        Comentar
      </Button>
    </form>
  );
};
