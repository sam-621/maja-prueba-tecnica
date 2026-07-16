import { User } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Blog } from '@/lib/api/types';
import { stripMarkdown } from '@/shared/utils/strip-markdown';

import { getStatusLabel } from '../constants/status-labels';

type Props = {
  blog: Blog;
  showStatus?: boolean;
};

export const BlogCard = ({ blog, showStatus }: Props) => {
  return (
    <Link to={`/blogs/${blog.slug}`} className="block">
      <Card className="transition-colors hover:border-ring">
        <CardHeader>
          <CardTitle className="text-base">{blog.title}</CardTitle>
          {showStatus ? (
            <Badge variant="outline" className="w-fit">
              {getStatusLabel(blog.status)}
            </Badge>
          ) : (
            blog.author && (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <User className="size-3.5" />
                {blog.author.fullname}
              </span>
            )
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {stripMarkdown(blog.content)}
          </p>
          {blog.categories && blog.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {blog.categories.map((category) => (
                <Badge key={category.id} variant="secondary">
                  {category.name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
