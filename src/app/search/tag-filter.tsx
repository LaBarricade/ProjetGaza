import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import  ScrollAreaComponent  from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import { Tag as TagIcon } from 'lucide-react';
import { Tag } from '@/components/ui/tag';
import {Tag as TagType } from '@/types/Tag';
import { Personality } from '@/types/Personality';

import { CheckboxItem } from '@radix-ui/react-dropdown-menu';

interface TagFilterProps {
  selected: TagType[]; //testerror string[]
  onChange: (selected: TagType[]) => void;
  // resultType: 'politicians' | 'quotes';
  // onResultTypeChange: (type: 'politicians' | 'quotes') => void;
  tagsList: TagType[];
}

/**
 * Returns the color of a tag if it exists in the available tags list, or 'default' otherwise.
 * @param {string} tagValue - The value of the tag to get the color for.
 * @param {TagType[]} tagsList - The list of available tags and their colors.
 * @returns {string} The color of the tag, or 'default' if the tag doesn't exist in the available tags list.
 */

const getTagColorCn = (tag: TagType) => {
const colorCode = `bg-${tag.color}-500 text-${tag.color}-foreground`;
return colorCode;
}

export function TagFilter({
  selected, //selected Tags filters.tags
  onChange, //onFilterschange.tags
  // resultType,
  // onResultTypeChange,
  tagsList,
}: TagFilterProps) {

    const [searchText, setSearchText] = useState('');

  // const [search, setSearch] = useState('');

  // const filtered = tagsList.filter((tag) =>
  //   tag.name.toLowerCase().includes(search.toLowerCase())
  // );

  // const toggleTag = (tag: TagType) => {

  //   onChange(selected.includes(tag) ? selected.filter((t) => t !== tag) : [...selected, tag]);
  // };

    // Filter tags based on search
  const filteredTags = useMemo(() => {
    if (!searchText) return tagsList;
    return tagsList.filter(tag => 
      tag.name?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [tagsList, searchText]);

  // Handle tag selection toggle
  const handleToggle = (tag: TagType) => {
    const isSelected = selected.some(t => t.id === tag.id);
    
    if (isSelected) {
      // Remove tag
      onChange(selected.filter(t => t.id !== tag.id));
    } else {
      // Add tag
      onChange([...selected, tag]);
    }
  };

  // Remove a specific tag from selection
  const handleRemove = (tagId: number) => {
    onChange(selected.filter(t => t.id !== tagId));
  };

  // Clear all selected tags
  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold flex items-center gap-2 justify-start text-md"><TagIcon size={18} />Tags</h3>
      <Input
        placeholder="Rechercher par tags..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="h-9"
      />
      <div className="h-40 overflow-y-scroll border rounded-md p-3">
      <ScrollAreaComponent>
       <div className="space-y-3">
          {filteredTags.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucun tag trouvé
            </p>
          ) : (
            filteredTags.map((tag) => {
              const isSelected = selected.some(t => t.id === tag.id);
              
              return (
                <div
                  key={tag.id}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded"
                  onClick={() => handleToggle(tag)}
                >
                  <div className="flex items-center">
                    <label
                      htmlFor={`tag-${tag.id}`}
                      className="text-sm flex-1 cursor-pointer"
                    >
                      {tag.name}
                    </label>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollAreaComponent>
      </div>
      {selected.length > 0 && (
        <div className="space-y-3">
<div className="flex flex-wrap gap-2">
  {selected.map((tag) => (
    <div
      key={tag.id}
      className="
        flex items-center gap-1.5
        rounded-full border
        bg-muted/50
        px-3 py-1
        text-xs font-medium
        text-foreground
        transition
        hover:bg-muted
      "
    >
      <span>{tag.name}</span>

      <button
        type="button"
        onClick={() => handleRemove(tag.id)}
        className="
          ml-1 rounded-full p-0.5
          text-muted-foreground
          hover:bg-destructive/10
          hover:text-destructive
          transition
        "
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  ))}
</div>

          {/* <Tabs
            value={resultType}
            onValueChange={(value: string) =>
              onResultTypeChange(value as 'politicians' | 'quotes')
            }
          >
            <TabsList className="w-full">
              <TabsTrigger value="politicians" className="flex-1">
                Politicians
              </TabsTrigger>
              <TabsTrigger value="quotes" className="flex-1">
                Quotes
              </TabsTrigger>
            </TabsList>
          </Tabs> */}
        </div>
      )}
    </div>
  );
}
