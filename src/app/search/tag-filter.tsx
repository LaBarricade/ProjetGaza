import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import  ScrollAreaComponent  from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import { Tag } from '@/components/ui/tag';
import { Tag as TagType } from '../personnalites/page';


interface TagFilterProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  resultType: 'politicians' | 'quotes';
  onResultTypeChange: (type: 'politicians' | 'quotes') => void;
  availableTags: TagType[];
}

/**
 * Returns the color of a tag if it exists in the available tags list, or 'default' otherwise.
 * @param {string} tagValue - The value of the tag to get the color for.
 * @param {TagType[]} availableTags - The list of available tags and their colors.
 * @returns {string} The color of the tag, or 'default' if the tag doesn't exist in the available tags list.
 */

const getTagColorCn = (tag: TagType) => {
const colorCode = `bg-${tag.color}-500 text-${tag.color}-foreground`;
return colorCode;
}

export function TagFilter({
  selected,
  onChange,
  resultType,
  onResultTypeChange,
  availableTags,
}: TagFilterProps) {
  const [search, setSearch] = useState('');

  const filtered = availableTags.filter((tag) =>
    tag.value.toLowerCase().includes(search.toLowerCase())
  );

  const toggleTag = (tag: string) => {
    onChange(selected.includes(tag) ? selected.filter((t) => t !== tag) : [...selected, tag]);
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm">Tags</h3>
      <Input
        placeholder="Search tags..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-9"
      />
      <div className="h-40 overflow-y-scroll border rounded-md p-3">
      <ScrollAreaComponent>
        <div className="space-y-2">
          {filtered.map((tag) => (
            <Button
              key={tag.value}
              variant={selected.includes(tag.value) ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start"
              onClick={() => toggleTag(tag.value)}
            >
              {tag.value}
            </Button>
          ))}
        </div>
      </ScrollAreaComponent>
      </div>
      {selected.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {selected.map((tag) => (
              // <div
              //   key={tag}
              //   className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs"
              // >
              //   {tag}
              //   <button
              //     onClick={() => toggleTag(tag)}
              //     className="hover:bg-primary-foreground/20 rounded"
              //   >
              //     <X className="w-3 h-3" />
              //   </button>
              // </div>
              <Tag key={tag} className={getTagColorCn(availableTags.find(t => t.value === tag)!)} size='md' variant='soft'>{tag}</Tag>
            ))}
          </div>
          <Tabs
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
          </Tabs>
        </div>
      )}
    </div>
  );
}
