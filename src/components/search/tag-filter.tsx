import { useMemo, useState, useRef, useEffect } from 'react';

import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { Tag as TagIcon } from 'lucide-react';
import { Tag as TagType } from '@/types/Tag';
import { Tag } from '@/components/ui/tag';
import { useHorizontalScroll } from './useHorizontalScroll';

interface TagFilterProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  tagsList: TagType[];
}

export function TagFilter({ selected, onChange, tagsList }: TagFilterProps) {
  const [searchText, setSearchText] = useState('');

  const scroll = useHorizontalScroll<HTMLDivElement>();

  // Filter tags based on search
  const filteredTags = useMemo(() => {
    if (!searchText) return tagsList;
    return tagsList.filter((tag) => tag.name?.toLowerCase().includes(searchText.toLowerCase()));
  }, [tagsList, searchText]);

  // Handle tag selection toggle
  const handleToggle = (tagId: string) => {
    const isSelected = selected.some((t) => t === tagId.toString());
    if (isSelected) {
      // Remove tag
      onChange(selected.filter((t) => t !== tagId.toString()));
    } else {
      // Add tag
      onChange([...selected, tagId]);
    }
  };

  // Remove a specific tag from selection
  const handleRemove = (e: React.MouseEvent, tagId: string) => {
    e.stopPropagation(); // Prevent toggle when clicking X
    onChange(selected.filter((t: string) => t !== tagId));
  };

  return (
    <div className="space-y-3 flex-1 w-full">
      <h3 className="font-semibold flex items-center gap-2 justify-start text-md">
        <TagIcon size={18} />
        Tags
      </h3>

      <Input
        placeholder="Rechercher un tag..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="h-8 max-w-72"
      />

      {/* Horizontally scrollable tag list */}
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
          <div className="flex gap-2 min-w-max pr-4">
            {filteredTags.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 w-full text-center">
                Aucun tag trouvé
              </p>
            ) : (
              filteredTags.map((tag) => {
                const isSelected = selected.some((t) => t === tag.id.toString());

                return (
                  <button
                    key={tag.id}
                    onClick={() => handleToggle(tag.id.toString())}
                    className={`
                      relative cursor-pointer transition-all
                      ${isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-90'}
                    `}
                  >
                    <Tag
                      key={tag.id}
                      size="sm"
                      variant={isSelected ? 'solid' : 'soft'}
                      className="flex items-center gap-0.5 transition-all animate-in fade-in duration-200"
                    >
                      {tag.name}

                      <span
                        onClick={(e) => (isSelected ? handleRemove(e, tag.id.toString()) : null)}
                        className={`${isSelected ? 'opacity-100' : 'opacity-0'}
                             inline-flex items-center justify-center
                            rounded-full
                            h-3 w-3
                            hover:bg-white/20
                            transition-colors`}
                      >
                        <X className="h-2.5 w-2.5" />
                      </span>
                    </Tag>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Fade gradient on the right to indicate scrollability */}
        {filteredTags.length > 0 && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        )}
      </div>

      {/* Selected count indicator */}
      {/* {selected.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {selected.length} tag{selected.length > 1 ? 's' : ''} sélectionné
          {selected.length > 1 ? 's' : ''}
        </p>
      )} */}
    </div>
  );
}
