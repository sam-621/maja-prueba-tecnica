type Props = {
  title: string;
  subtitle: string;
};

export const EmptyState = ({ title, subtitle }: Props) => {
  return (
    <div className="rounded-lg border border-dashed p-10 text-center">
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
};
