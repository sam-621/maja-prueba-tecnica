import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { BlogStatus } from '@/lib/api/types';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['draft', 'published', 'archived']),
});

export type BlogFormInput = z.infer<typeof schema>;

type Options = {
  defaultValues?: Partial<BlogFormInput>;
  onSubmit: (data: BlogFormInput) => Promise<void> | void;
};

export const useBlogForm = ({ defaultValues, onSubmit }: Options) => {
  const form = useForm<BlogFormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      content: defaultValues?.content ?? '',
      status: (defaultValues?.status as BlogStatus) ?? 'draft',
    },
  });

  return { form, onSubmit: form.handleSubmit(onSubmit) };
};
