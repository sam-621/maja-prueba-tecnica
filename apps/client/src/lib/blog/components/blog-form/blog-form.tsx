import { Loader2 } from 'lucide-react';
import { Controller } from 'react-hook-form';

import { Button } from '@/shared/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { MarkdownEditor } from '@/shared/components/markdown/markdown-editor';
import type { Blog, BlogStatus } from '@/lib/api/types';
import { CategoriesSelect } from '@/lib/category/components/categories-select';
import { getStatusLabel } from '@/lib/blog/constants/status-labels';

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
          <FieldLabel htmlFor="title">Título</FieldLabel>
          <Input
            id="title"
            placeholder="Mi primera publicación"
            aria-invalid={!!errors.title}
            {...register('title')}
          />
          {errors.title && <FieldError>{errors.title.message}</FieldError>}
        </Field>

        <Field className="sm:w-40">
          <FieldLabel htmlFor="status">Estado</FieldLabel>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue>
                    {(value: BlogStatus) => getStatusLabel(value)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                  <SelectItem value="archived">Archivado</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="categories">Categorías</FieldLabel>
        <Controller
          control={control}
          name="categories"
          render={({ field }) => (
            <CategoriesSelect
              id="categories"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="content">Contenido</FieldLabel>
        <Controller
          control={control}
          name="content"
          render={({ field }) => (
            <MarkdownEditor
              id="content"
              placeholder="Escribe algo... Puedes usar Markdown"
              rows={12}
              aria-invalid={!!errors.content}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
        {errors.content && <FieldError>{errors.content.message}</FieldError>}
      </Field>

      <Button type="submit" disabled={isLoading} className="self-start">
        {isLoading && <Loader2 className="animate-spin" />}
        {isUpdate ? 'Guardar cambios' : 'Crear publicación'}
      </Button>
    </form>
  );
};
