import { Loader2 } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

type Props = {
  onClick: () => void;
  isLoading?: boolean;
};

export const LoadMoreButton = ({ onClick, isLoading }: Props) => {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={isLoading}
      className="self-center"
    >
      {isLoading && <Loader2 className="animate-spin" />}
      Cargar más
    </Button>
  );
};
