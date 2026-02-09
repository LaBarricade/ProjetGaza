import {useState, useRef, useEffect, ReactNode} from 'react';
import { Input } from '@/components/ui/input';
import { Building2, X } from 'lucide-react';
import { Tag } from '@/components/ui/tag';
import { useHorizontalScroll } from './useHorizontalScroll';
import {FilterableType} from "@/types/FilterableType";

export function OptionsFilter({ selected, onChange, items, headingNode }: {
  selected: string[];
  onChange: (selected: string[]) => void;
  items: FilterableType[];
  headingNode: ReactNode
}) {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scroll = useHorizontalScroll<HTMLDivElement>();

  const filtered = items.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const toggleItem = (id: string) => {
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
          {headingNode}
      </h3>
      <div className="relative">
        <Input
          ref={inputRef}
          placeholder="Rechercher..."
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
            {filtered.map((item) => {
              const isSelected = selected.includes(item.id.toString());
              return (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id.toString())}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center justify-between"
                  disabled={isSelected}
                >
                  <span
                    className={`flex items-center gap-2 ${isSelected ? 'text-muted-foreground' : ''}`}
                  >
                    {item.name} {item.quotes_count && `(${item.quotes_count})`}
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
          className="overflow-x-scroll pb-2 scroll-thin scrollbar-thumb-muted scrollbar-track-transparent
                      cursor-grab active:cursor-grabbing select-none "
        >
          <div className="flex min-w-max flex-wrap gap-2">
            {selected.map((id) => {
              const item = items.find((p) => p.id.toString() === id);
              return (
                <Tag key={id} size="sm" variant="solid" className="flex items-center gap-2">
                  {item?.name}
                  <button
                    onClick={() => toggleItem(id)}
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
