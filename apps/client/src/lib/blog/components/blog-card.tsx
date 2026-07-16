import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Blog } from '@/lib/api/types';

type Props = {
  blog: Blog;
  showStatus?: boolean;
};

export const BlogCard = ({ blog, showStatus }: Props) => {
  return (
    <Link to={`/blogs/${blog.id}`} className="block">
      <Card className="transition-colors hover:border-ring">
        <CardHeader>
          <CardTitle className="text-base">{blog.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {blog.content}
          </p>
          {showStatus ? (
            <Badge variant="outline" className="w-fit capitalize">
              {blog.status}
            </Badge>
          ) : (
            blog.author && (
              <Badge variant="outline" className="w-fit">
                {blog.author.fullname}
              </Badge>
            )
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
