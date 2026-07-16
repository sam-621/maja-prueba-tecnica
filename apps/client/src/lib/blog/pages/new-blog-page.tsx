import { ArrowLeft } from 'lucide-react';

import { ButtonLink } from '@/shared/components/ui/button-link';
import { BlogForm } from '@/lib/blog/components/blog-form/blog-form';

export const NewBlogPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <ButtonLink to="/" variant="ghost" size="sm" className="self-start">
          <ArrowLeft />
          Volver
        </ButtonLink>
        <h1 className="text-2xl font-semibold">Escribir una publicación</h1>
      </div>

      <BlogForm />
    </div>
  );
};
