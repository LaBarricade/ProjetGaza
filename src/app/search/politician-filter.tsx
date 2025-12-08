import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ScrollAreaComponent  from '@/components/ui/scroll-area';
import { X } from 'lucide-react';

interface PoliticianFilterProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  availablePoliticians: { id: string; name: string }[];
}

export function PoliticianFilter({
  selected,
  onChange,
  availablePoliticians,
}: PoliticianFilterProps) {
  const [search, setSearch] = useState('');

  const filtered = availablePoliticians.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const togglePolitician = (id: string) => {
    onChange(
      selected.includes(id) ? selected.filter((p) => p !== id) : [...selected, id]
    );
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm">Politicians</h3>
      <Input
        placeholder="Search politicians..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-9"
      />
      <div className="h-40 border rounded-md p-3">
      <ScrollAreaComponent>
        <div className="space-y-2">
          {filtered.map((politician) => (
            <Button
              key={politician.id}
              variant={selected.includes(politician.id) ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start"
              onClick={() => togglePolitician(politician.id)}
            >
              {politician.name}
            </Button>
          ))}
        </div>
      </ScrollAreaComponent>
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((id) => (
            <div
              key={id}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs"
            >
              {availablePoliticians.find((p) => p.id === id)?.name}
              <button
                onClick={() => togglePolitician(id)}
                className="hover:bg-primary-foreground/20 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
