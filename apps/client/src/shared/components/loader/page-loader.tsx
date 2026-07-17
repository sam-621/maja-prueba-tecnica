import { Loader2 } from 'lucide-react';

import { cn } from '@/shared/utils/utils';

type Props = {
  className?: string;
};

export const PageLoader = ({ className }: Props) => {
  return (
    <div
      className={cn('flex w-full items-center justify-center py-16', className)}
    >
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};
