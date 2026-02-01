import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Building2, X } from 'lucide-react';
import { Party } from '@/types/Party';
import { Tag } from '@/components/ui/tag';
import { useHorizontalScroll } from './useHorizontalScroll';

interface PartyFilterProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  partiesList: Party[];
}

export function PartyFilter({ selected, onChange, partiesList }: PartyFilterProps) {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scroll = useHorizontalScroll<HTMLDivElement>();

  const filtered = partiesList.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const toggleParty = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((p) => p !== id) : [...selected, id]);
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
    <div className="space-y-3 min-w-0 flex-1">
      <h3 className="font-semibold text-md flex items-center justify-start gap-2">
        <Building2 size={18} />
        Parti politique
      </h3>
      <div className="relative">
        <Input
          ref={inputRef}
          placeholder="Rechercher un parti..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(e.target.value.length > 0);
          }}
          onFocus={() =>  setShowDropdown(true)}
          className="h-8"
        />
        {showDropdown && filtered.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {filtered.map((party) => {
              const isSelected = selected.includes(party.id.toString());
              return (
                <button
                  key={party.id}
                  onClick={() => toggleParty(party.id.toString())}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center justify-between"
                  disabled={isSelected}
                >
                  <span
                    className={`flex items-center gap-2 ${isSelected ? 'text-muted-foreground' : ''}`}
                  >
                    {/* {party.color && (
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: party.color }}
                      />
                    )} */}
                    {party.name}
                  </span>
                  {isSelected && <span className="text-xs text-muted-foreground">Sélectionné</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
      {selected.length > 0 && (
        <div
          ref={scroll.ref}
          {...scroll.handlers}
          className="
    overflow-x-scroll pb-2
    scroll-thin scrollbar-thumb-muted scrollbar-track-transparent
    cursor-grab active:cursor-grabbing
    select-none
  "
        >
          <div className="flex min-w-max flex-wrap gap-2">
            {selected.map((id) => {
              const party = partiesList.find((p) => p.id.toString() === id);
              return (
                <Tag key={id} size="sm" variant="solid" className="flex items-center gap-2">
                  {party?.name}
                  <button
                    onClick={() => toggleParty(id)}
                    className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Tag>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
