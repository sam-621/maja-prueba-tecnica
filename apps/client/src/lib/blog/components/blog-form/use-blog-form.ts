import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import type { Blog } from '@/lib/api/types';
import { useCreateBlog } from '@/lib/blog/hooks/use-create-blog';
import { useUpdateBlog } from '@/lib/blog/hooks/use-update-blog';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['draft', 'published', 'archived']),
});

export type BlogFormInput = z.infer<typeof schema>;

export const useBlogForm = (blog?: Blog | null) => {
  const navigate = useNavigate();
  const { createBlog, isLoading: isCreating } = useCreateBlog();
  const { updateBlog, isLoading: isUpdating } = useUpdateBlog();

  const isUpdate = !!blog;

  const form = useForm<BlogFormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: blog?.title ?? '',
      content: blog?.content ?? '',
      status: blog?.status ?? 'draft',
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const result = blog
      ? await updateBlog(blog.id, data)
      : await createBlog(data);

    if (!result.isSuccess) {
      toast.error(result.error);
      return;
    }

    toast.success(isUpdate ? 'Post updated' : 'Post created');
    navigate(`/blogs/${result.blog.id}`);
  });

  return { form, onSubmit, isUpdate, isLoading: isCreating || isUpdating };
};
