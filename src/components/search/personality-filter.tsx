import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { UserRound, X } from 'lucide-react';
import { Tag as TagType } from '@/types/Tag';
import { Personality } from '@/types/Personality';
import { Tag } from '@/components/ui/tag';
import { useHorizontalScroll } from './useHorizontalScroll';

interface PersonalityFilterProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  personalitiesList: Personality[];
}

export function PersonalityFilter({
  selected,
  onChange,
  personalitiesList,
}: PersonalityFilterProps) {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scroll = useHorizontalScroll<HTMLDivElement>();

  const filtered = personalitiesList.filter(
    (p) =>
      p.lastname.toLowerCase().includes(search.toLowerCase()) ||
      p.firstname.toLowerCase().includes(search.toLowerCase())
  );

  const togglePersonality = (id: string | null) => {
    if (!id) return;
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
        <UserRound size={18} />
        Politicien
      </h3>
      <div className="relative">
        <Input
          ref={inputRef}
          placeholder="Rechercher un politicien..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(e.target.value.length > 0);
          }}
          onFocus={() => search.length > 0 && setShowDropdown(true)}
          className="h-8"
        />
        {showDropdown && filtered.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {filtered.map((politician) => {
              const isSelected = politician.id && selected.includes(politician.id.toString());
              return (
                <button
                  key={politician.id}
                  onClick={() => togglePersonality(politician.id ? politician.id.toString() : null)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center justify-between"
                  disabled={isSelected || false}
                >
                  <span className={isSelected ? 'text-muted-foreground' : ''}>
                    {politician.firstname} {politician.lastname}
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
          className="overflow-x-scroll pb-2 scroll-thin scrollbar-thumb-muted scrollbar-track-transparent cursor-grab active:cursor-grabbing select-none"
        >
          <div className="flex flex-wrap min-w-max gap-2">
            {selected.map((id) => {
              const politician = personalitiesList.find((p) => p.id.toString() === id);
              return (
                <Tag key={id} size="sm" variant="solid" className="flex items-center gap-2">
                  {politician?.firstname} {politician?.lastname}
                  <button
                    onClick={() => togglePersonality(id)}
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
