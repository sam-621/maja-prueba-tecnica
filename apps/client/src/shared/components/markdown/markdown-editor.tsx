import { Eye, Pencil } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { cn } from '@/shared/utils/utils';

import { MarkdownPreview } from './markdown-preview';

type Props = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  rows?: number;
  'aria-invalid'?: boolean;
};

type Tab = 'write' | 'preview';

export const MarkdownEditor = ({
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  rows = 12,
  'aria-invalid': ariaInvalid,
}: Props) => {
  const [tab, setTab] = useState<Tab>('write');

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <Button
          type="button"
          size="sm"
          variant={tab === 'write' ? 'secondary' : 'ghost'}
          onClick={() => setTab('write')}
        >
          <Pencil />
          Editar
        </Button>
        <Button
          type="button"
          size="sm"
          variant={tab === 'preview' ? 'secondary' : 'ghost'}
          onClick={() => setTab('preview')}
        >
          <Eye />
          Vista previa
        </Button>
        <span className="ml-auto text-xs text-muted-foreground">
          Soporta Markdown
        </span>
      </div>

      {tab === 'write' ? (
        <Textarea
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows}
          aria-invalid={ariaInvalid}
        />
      ) : (
        <div
          className={cn(
            'min-h-40 rounded-lg border border-input px-3 py-2',
            !value.trim() && 'text-muted-foreground'
          )}
        >
          {value.trim() ? (
            <MarkdownPreview content={value} />
          ) : (
            'Nada para previsualizar todavía.'
          )}
        </div>
      )}
    </div>
  );
};
