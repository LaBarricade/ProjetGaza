import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Briefcase, X } from 'lucide-react';
import { MandateType } from '@/types/MandateType';
import { Tag } from '@/components/ui/tag';
import { useHorizontalScroll } from './useHorizontalScroll';

interface MandateFilterProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  mandateTypesList: MandateType[];
}

export function MandateFilter({ selected, onChange, mandateTypesList }: MandateFilterProps) {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scroll = useHorizontalScroll<HTMLDivElement>();

  const filtered = mandateTypesList.filter(
    (m) =>
      m.label.toLowerCase().includes(search.toLowerCase()) ||
      m.code.toLowerCase().includes(search.toLowerCase())
  );

  const toggleMandate = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((m) => m !== id) : [...selected, id]);
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
    <div className="space-y-3 flex-1 min-w-0">
      <h3 className="font-semibold text-md flex items-center justify-start gap-2">
        <Briefcase size={18} />
        Mandat
      </h3>
      <div className="relative">
        <Input
          ref={inputRef}
          placeholder="Rechercher un mandat..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(e.target.value.length > 0);
          }}
          onFocus={() => setShowDropdown(true)}
          className="h-8"
        />
        {showDropdown && filtered.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {filtered.map((mandate) => {
              const isSelected = selected.includes(mandate.id.toString());
              return (
                <button
                  key={mandate.id}
                  onClick={() => toggleMandate(mandate.id.toString())}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center justify-between"
                  disabled={isSelected}
                >
                  <span className={isSelected ? 'text-muted-foreground' : ''}>{mandate.label}</span>
                  {isSelected && <span className="text-xs text-muted-foreground">Sélectionné</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
      {selected.length > 0 && (
        <div className="relative w-full">
          <div
            ref={scroll.ref}
            {...scroll.handlers}
            className="
    overflow-x-scroll scroll-thin pb-2
    scrollbar-track-transparent scrollbar-thumb-muted
    cursor-grab active:cursor-grabbing
    select-none
  "
          >
            <div className="flex flex-wrap min-w-max gap-2">
              {selected.map((id) => {
                const mandate = mandateTypesList.find((m) => m.id.toString() === id);
                return (
                  <Tag key={id} size="sm" variant="solid" className="flex items-center gap-2">
                    {mandate?.label}
                    <button
                      onClick={() => toggleMandate(id)}
                      className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Tag>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
