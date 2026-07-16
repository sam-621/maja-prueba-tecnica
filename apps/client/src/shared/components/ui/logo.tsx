import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';
import { LOGO_PATH, LOGO_VIEWBOX } from '@/shared/branding/logo';

export const Logo = ({ className, ...props }: ComponentProps<'svg'>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox={LOGO_VIEWBOX}
      className={cn('size-5', className)}
      aria-hidden="true"
      {...props}
    >
      <path fill="currentColor" d={LOGO_PATH} />
    </svg>
  );
};
