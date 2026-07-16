import type { BlogStatus } from '@/lib/api/types';

export const STATUS_LABELS: Record<BlogStatus, string> = {
  draft: 'Borrador',
  published: 'Publicado',
  archived: 'Archivado',
};

export const getStatusLabel = (status: BlogStatus): string =>
  STATUS_LABELS[status] ?? status;
