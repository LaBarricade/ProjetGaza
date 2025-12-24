import { Input } from '@/components/ui/input';
import { Quote, X } from 'lucide-react';

interface QuoteFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function QuoteFilter({ value, onChange }: QuoteFilterProps) {
  const handleInputChange = (text: string) => {
    onChange(text ? [text] : []);
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-md flex items-center justify-start gap-2"><Quote size={18} />Citation</h3>
      <div className="relative">
        <Input
          placeholder="Rechercher par citation..."
          value={value[0] || ''}
          onChange={(e) => handleInputChange(e.target.value)}
          className="h-9 pr-8"
        />
        {value[0] && (
          <button
            onClick={() => onChange([])}
            className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-muted p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
