import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import type { Blog, Category } from '@/lib/api/types';
import { useCreateBlog } from '@/lib/blog/hooks/use-create-blog';
import { useUpdateBlog } from '@/lib/blog/hooks/use-update-blog';

const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const schema = z.object({
  title: z.string().trim().min(1, 'El título es obligatorio'),
  content: z.string().min(1, 'El contenido es obligatorio'),
  status: z.enum(['draft', 'published', 'archived']),
  categories: z.array(categorySchema),
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
      categories: blog?.categories ?? [],
    },
  });

  const onSubmit = form.handleSubmit(async ({ categories, ...rest }) => {
    const payload = {
      ...rest,
      categoryIds: categories.map((category: Category) => category.id),
    };

    const result = blog
      ? await updateBlog(blog.id, payload)
      : await createBlog(payload);

    if (!result.isSuccess) {
      toast.error(result.error);
      return;
    }

    toast.success(isUpdate ? 'Publicación actualizada' : 'Publicación creada');
    navigate(`/blogs/${result.blog.slug}`);
  });

  return { form, onSubmit, isUpdate, isLoading: isCreating || isUpdating };
};
