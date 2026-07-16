import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { ButtonLink } from '@/shared/components/ui/button-link';
import { BlogForm } from '@/lib/blog/components/blog-form/blog-form';
import { useCreateBlog } from '@/lib/blog/hooks/use-create-blog';

export const NewBlogPage = () => {
  const navigate = useNavigate();
  const { createBlog, isLoading } = useCreateBlog();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <ButtonLink to="/" variant="ghost" size="sm" className="self-start">
          <ArrowLeft />
          Back
        </ButtonLink>
        <h1 className="text-2xl font-semibold">Write a post</h1>
      </div>

      <BlogForm
        submitLabel="Create post"
        isLoading={isLoading}
        onSubmit={async (data) => {
          const result = await createBlog(data);

          if (!result.isSuccess) {
            toast.error(result.error);
            return;
          }

          toast.success('Post created');
          navigate(`/blogs/${result.blog.id}`);
        }}
      />
    </div>
  );
};
