import { Loader2 } from 'lucide-react';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Blog } from '@/lib/api/types';

import { useBlogForm } from './use-blog-form';

type Props = {
  blog?: Blog | null;
};

export const BlogForm = ({ blog }: Props) => {
  const { form, onSubmit, isUpdate, isLoading } = useBlogForm(blog);
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <Field className="flex-1">
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input
            id="title"
            placeholder="My first post"
            aria-invalid={!!errors.title}
            {...register('title')}
          />
          {errors.title && <FieldError>{errors.title.message}</FieldError>}
        </Field>

        <Field className="sm:w-40">
          <FieldLabel htmlFor="status">Status</FieldLabel>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="content">Content</FieldLabel>
        <Textarea
          id="content"
          placeholder="Write something..."
          rows={10}
          aria-invalid={!!errors.content}
          {...register('content')}
        />
        {errors.content && <FieldError>{errors.content.message}</FieldError>}
      </Field>

      <Button type="submit" disabled={isLoading} className="self-start">
        {isLoading && <Loader2 className="animate-spin" />}
        {isUpdate ? 'Save changes' : 'Create post'}
      </Button>
    </form>
  );
};
