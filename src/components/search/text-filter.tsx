'use client';
import { Input } from '@/components/ui/input';
import { LucideProps, Search, X } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes, useEffect, useRef, useState } from 'react';

interface TextFilterProps {
  selected: string;
  onChange: (selected: string) => void;
  config?: {
    headerTitle?: string | boolean;
    icon?: ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;
    inputPlaceholder?: string;
  };
}
const DEBOUNCE_MS = 350;

export function TextFilter({ selected, onChange, config }: TextFilterProps) {
  const [searchText, setSearchText] = useState<string>(selected);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearchText(selected);
  }, [selected]);

  const Icon = config?.icon ?? Search;
  const headerTitle = config?.headerTitle ?? 'Rechercher';
  const inputPlaceholder = config?.inputPlaceholder ?? 'Rechercher...';
  const hideHeader = headerTitle === false;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange(value);
    }, DEBOUNCE_MS);
  };

  const handleClear = () => {
    setSearchText('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onChange('');
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="space-y-3 w-full">
      {!hideHeader && (
        <h3 className="font-semibold text-md flex items-center justify-start gap-2">
          <Icon size={18} />
          {headerTitle}
        </h3>
      )}
      <div className="relative">
        <Input
          placeholder={inputPlaceholder}
          value={searchText}
          onChange={handleSearchChange}
          // When header is hidden, icon sits on the right so we need more right padding;
          // when there's active text the clear button also appears, so pad for both.
          className={`h-8 ${hideHeader ? 'pr-8' : 'pr-8'}`}
        />
        {/* Right-side icons: clear button first (when text exists), then the icon (only when header is hidden) */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchText.length > 0 && (
            <button onClick={handleClear} className="hover:bg-muted p-1 rounded">
              <X className="w-4 h-4" />
            </button>
          )}
          {hideHeader && <Icon size={16} className="text-muted-foreground" />}
        </div>
      </div>
    </div>
  );
}
