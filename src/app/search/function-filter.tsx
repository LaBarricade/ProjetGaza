import { Button } from '@/components/ui/button';
import  ScrollAreaComponent  from '@/components/ui/scroll-area';
import { Tag } from '@/components/ui/tag';
import { BriefcaseBusiness, X } from 'lucide-react';

interface FunctionFilterProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  availableFunctions: string[];
}

export function FunctionFilter({
  selected,
  onChange,
  availableFunctions,
}: FunctionFilterProps) {
  const toggleFunction = (func: string) => {
    onChange(
      selected.includes(func) ? selected.filter((f) => f !== func) : [...selected, func]
    );
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-md flex items-center justify-start gap-2"><BriefcaseBusiness size={18} />Fonction</h3>
      <div className="h-40 border overflow-y-scroll rounded-md p-3">
      <ScrollAreaComponent>
        <div className="space-y-2">
          {availableFunctions.map((func) => (
            <Button
              key={func}
              variant={selected.includes(func) ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start"
              onClick={() => toggleFunction(func)}
            >
              {func}
            </Button>
          ))}
        </div>
      </ScrollAreaComponent>
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((func) => (
            // <div
            //   key={func}
            //   className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs"
            // >
            //   {func}
            //   <button
            //     onClick={() => toggleFunction(func)}
            //     className="hover:bg-primary-foreground/20 rounded"
            //   >
            //     <X className="w-3 h-3" />
            //   </button>
            // </div>
                          <Tag key={func} size='sm' variant='solid' className='flex items-center gap-2'>
                            {func}
                             <button
   onClick={() => toggleFunction(func)}
                                 className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                             >
                               <X className="w-3 h-3" />
                             </button>
                          </Tag>
          ))}
        </div>
      )}
    </div>
  );
}
