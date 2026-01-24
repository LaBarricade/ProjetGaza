import { Input } from '@/components/ui/input';
import { Quote, X } from 'lucide-react';
import { Quote as QuoteType } from '@/types/Quote';
import { useEffect, useState } from 'react';
// interface QuoteFilterProps {
//   value: string[];
//   onChange: (value: string[]) => void;
// }

interface QuoteFilterProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  quotesList: QuoteType[];
}

export function QuoteFilter({ selected, onChange, quotesList }: QuoteFilterProps) {
    const [searchText, setSearchText] = useState<string>('');

     useEffect(() => {
    if (selected.length > 0) {
      setSearchText(selected[0]);
    }
  }, [selected]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    
    // Update filter with debounce would be ideal, but for simplicity:
    if (value) {
      onChange([value]);
    } else {
      onChange([]);
    }
  };

  // const handleInputChange = (text: string) => {
  //   onChange(text ? [text] : []);
  // };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-md flex items-center justify-start gap-2"><Quote size={18} />Citation</h3>
      <div className="relative">
        <Input
          placeholder="Rechercher par citation..."
          // value={value[0] || ''}
          // onChange={(e) => handleInputChange(e.target.value)}
          value={searchText}
          onChange={handleSearchChange}
          className="h-9 pr-8"
        />
        {selected.length > 0 && (
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
