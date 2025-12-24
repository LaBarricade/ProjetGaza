import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { Personality } from '../personnalites/page';

interface PoliticianFilterProps {
  selected: number[];
  onChange: (selected: number[]) => void;
  availablePoliticians: Personality[];
}

export function PoliticianFilter({
  selected,
  onChange,
  availablePoliticians,
}: PoliticianFilterProps) {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = availablePoliticians.filter((p) =>
    p.nom.toLowerCase().includes(search.toLowerCase()) ||
    p.prénom.toLowerCase().includes(search.toLowerCase())
  );

  const togglePolitician = (id: number | null) => {
    if (!id) return;
    onChange(
      selected.includes(id) ? selected.filter((p) => p !== id) : [...selected, id]
    );
    setSearch('');
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm">Politiciens</h3>
      <div className="relative">
        <Input
          ref={inputRef}
          placeholder="Rechercher des politiciens..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(e.target.value.length > 0);
          }}
          onFocus={() => search.length > 0 && setShowDropdown(true)}
          className="h-9"
        />
        {showDropdown && filtered.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {filtered.map((politician) => {
              const isSelected = politician.id && selected.includes(politician.id);
              return (
                <button
                  key={politician.id}
                  onClick={() => togglePolitician(politician.id ? Number(politician.id) : null)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center justify-between"
                  disabled={isSelected || false}
                >
                  <span className={isSelected ? 'text-muted-foreground' : ''}>
                    {politician.prénom} {politician.nom}
                  </span>
                  {isSelected && (
                    <span className="text-xs text-muted-foreground">Sélectionné</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((id) => {
            const politician = availablePoliticians.find((p) => Number(p.id) === id);
            return (
              <div
                key={id}
                className="flex items-center gap-2 bg-black text-white px-3 py-1 rounded-full text-xs"
              >
                {politician?.prénom} {politician?.nom}
                <button
                  onClick={() => togglePolitician(id)}
                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}