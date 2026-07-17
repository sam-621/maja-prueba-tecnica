import { Skeleton } from '@/shared/components/ui/skeleton';

export const CommentSkeleton = () => {
  return (
    <div className="flex gap-3">
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div className="flex flex-1 flex-col gap-2 py-1">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3.5 w-full max-w-md" />
      </div>
    </div>
  );
};
