import { useState, useRef, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin, X } from 'lucide-react';
import { Personality } from '@/types/Personality';
import { Tag } from '@/components/ui/tag';
import { useHorizontalScroll } from './useHorizontalScroll';

interface DepartmentFilterProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  personalitiesList: Personality[];
}

export function DepartmentFilter({ selected, onChange, personalitiesList }: DepartmentFilterProps) {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scroll = useHorizontalScroll<HTMLDivElement>();

  //  unique department names
  const allDepartments = useMemo(() => {
    const seen = new Set<string>();
    for (const p of personalitiesList) {
      const dept = p.department?.trim();
      if (dept) seen.add(dept);
    }
    return Array.from(seen).sort((a, b) => a.localeCompare(b, 'fr'));
  }, [personalitiesList]);

  // Filter by search string, exclude already-selected departments
  const filtered = useMemo(() => {
    const lower = search.toLowerCase();
    return allDepartments.filter(
      (dept) => dept.toLowerCase().includes(lower) && !selected.includes(dept)
    );
  }, [allDepartments, search, selected]);

  const toggleDepartment = (dept: string) => {
    onChange(selected.includes(dept) ? selected.filter((d) => d !== dept) : [...selected, dept]);
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
      <h3 className="font-semibold text-md flex items-center justify-start gap-2">
        <MapPin size={18} />
        Département
      </h3>
      <div className="relative">
        <Input
          ref={inputRef}
          placeholder="Rechercher un département..."
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
            {filtered.map((dept) => (
              <button
                key={dept}
                onClick={() => toggleDepartment(dept)}
                className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent transition-colors"
              >
                {dept}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected chips */}
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
          <div className="flex flex-wrap scroll-thin gap-2">
            {selected.map((dept) => (
              <Tag key={dept} size="sm" variant="solid" className="flex items-center gap-2">
                {dept}
                <button
                  onClick={() => toggleDepartment(dept)}
                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Tag>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
