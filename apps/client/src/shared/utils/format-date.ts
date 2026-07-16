export const formatDate = (value: string): string => {
  return new Date(value).toLocaleDateString('es', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
