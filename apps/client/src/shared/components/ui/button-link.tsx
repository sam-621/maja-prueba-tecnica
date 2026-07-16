import type { VariantProps } from 'class-variance-authority';
import { Link, type LinkProps } from 'react-router-dom';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = LinkProps & VariantProps<typeof buttonVariants>;

export const ButtonLink = ({ className, variant, size, ...props }: Props) => {
  return (
    <Link
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
};
