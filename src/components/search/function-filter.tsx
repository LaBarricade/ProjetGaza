// "use client";
// import { Button } from '@/components/ui/button';
// import  ScrollAreaComponent  from '@/components/ui/scroll-area';
// import { Tag } from '@/components/ui/tag';
// import { BriefcaseBusiness, Menu, X } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { useSearchFilters } from './useSearchFilters';
// import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
// import TagLabel from '../tag';
// import { useRouter } from 'next/navigation';
// import { Tag as TagType} from '@/types/Tag';

// interface FunctionFilterProps {
//   // selected: string[];
//   // onChange: (selected: string[]) => void;
//   urlParams: URLSearchParams;
//    functionsList: string[];
// }

// const normalizeFunction = (fonction: string): string => {
//   if (!fonction) return "";
  
//     let canonical = CANONICAL_FUNCTIONS.find((title) =>
//     title.toLowerCase().startsWith(fonction.toLowerCase())
//   );
//   if(canonical) {
//         // We capitalize the first letter of the canonical function name to make it easier to search and filter.
//         // We also remove any characters after the first space to make sure we only get the function name and not any parameters.
//         canonical = canonical
//           ?.charAt(0)
//           .toUpperCase()
//           .concat(canonical?.slice(1).split(" ")[0])
//         return canonical;
//   }


//   let value = fonction.trim();
//     value = value.replace(/ée/g, "é");
//   value = value.replace(/te/g, "t");
//   value = value.charAt(0) .toUpperCase()
//           .concat(value?.slice(1).split(" ")[0])
  
//   value = value.split(" ")[0];
//   value = value.replace(/[.,;:!?]+$/, "");
  
//   return value.trim();
// };

// const CANONICAL_FUNCTIONS = [
//   "Président de la république",
//   "Secrétaire général",
//   "Président de la région",
//   "Député européen",
//   "Premier ministre",
//   "Conseiller municipal",
//   "Conseiller départemental",
//   "Conseiller régional",
//   "Président de département"
// ];

// export function FunctionFilter({
//   // selected,
//   // onChange,
//   urlParams,
//    functionsList,
// }: FunctionFilterProps) {
//   const { filters, updateFilter, removeFilter, clearFilters } = useSearchFilters();
//   // const [selectedFunctions, setSelectedFunctions] = useState<string[]>(filters.functions || []);
//   const router = useRouter();
 
//     const handleFilterChange = (filterType: string, values: any, updateFilter: any) => {
//     updateFilter(filterType as any, values);
    
//     // Build new URL with updated filters
//     const params = new URLSearchParams();  
//     // Add relevant filters based on the values and current state
//     if (filterType === 'functions' && values.length > 0) {
//       params.set('function', values[0]);
//     }     
//     router.push(`/citations?${params.toString()}`);
//   };

//    // Sync with filters
//   // useEffect(() => {
//   //   setSelectedFunctions(filters.functions || []);
//   // }, [filters.functions]);

//   const toggleFunction = (func: string) => {
//     const newSelected = filters.functions.includes(func) 
//       ? filters.functions.filter((f) => f !== func) 
//       : [...filters.functions, func];
    
//     // setSelectedFunctions(newSelected);
//     updateFilter('functions', newSelected);
//   };

//   const filteredFunctions = functionsList.map(normalizeFunction).filter((v, i, a) => a.indexOf(v) === i);
 


//   return (
//     <div className="space-y-3 w-fit">
//       <div className="flex items-center justify-between">
//         <h3 className="font-semibold text-md flex items-center justify-start gap-2">
//           <BriefcaseBusiness size={18} />Fonction
//         </h3>
        
//         {filters.functions.length > 0 && (
//           <Button 
//             variant="ghost" 
//             size="sm" 
//             onClick={clearFilters}
//             className="h-6 text-xs"
//           >
//             Tout effacer
//           </Button>
//         )}
//       </div>

//       {/* Dropdown for selecting functions */}
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="outline" className="w-full justify-start">
//             <BriefcaseBusiness className="mr-2 h-4 w-4" />
//             Sélectionner des fonctions
//             {filters.functions.length > 0 && (
//               <span className="ml-auto bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
//                 {filters.functions.length}
//               </span>
//             )}
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto">
//           <DropdownMenuGroup>
//             {filteredFunctions.map((func, i) => (
//               <DropdownMenuCheckboxItem 
//                 key={i} 
//                 checked={filters.functions.includes(func)}
//                 onCheckedChange={() => toggleFunction(func)}
//                 className="cursor-pointer"
//               >
//                 {func}
//               </DropdownMenuCheckboxItem>
//             ))}
//           </DropdownMenuGroup>
//         </DropdownMenuContent>
//       </DropdownMenu>

//       {/* Display selected functions as tags */}
//       {filters.functions.length > 0 && (
//         <div className="flex flex-wrap gap-2 mt-2">
//           {filters.functions.map((func) => (
//             <Tag 
//               key={func} 
//               size="sm" 
//               variant="solid" 
//               className="flex items-center gap-2 animate-in fade-in duration-200"
//             >
//               {func}
//               <button
//                 onClick={() => removeFilter("functions", func)}
//                 className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
//               >
//                 <X className="w-3 h-3" />
//               </button>
//             </Tag>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import { Button } from '@/components/ui/button';
import ScrollAreaComponent from '@/components/ui/scroll-area';
import { Tag } from '@/components/ui/tag';
import { BriefcaseBusiness, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchFilters } from './useSearchFilters';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import TagLabel from '../tag';
import { useRouter } from 'next/navigation';
import { Tag as TagType } from '@/types/Tag';

interface FunctionFilterProps {
  urlParams: URLSearchParams;
  functionsList: string[];
}

// Full function titles that should be kept complete (exceptions to stop-word rules)
const COMPLETE_FUNCTIONS = [
  "président de la république",
  "président de la région",
  "président du département",
  "président de département",
  "premier ministre",
  "secrétaire d'état",
  "secrétaire général",
  "député européen",
  "conseiller municipal",
  "conseiller départemental",
  "conseiller régional",
  "premier secrétaire",
  "maire",
  "député",
  "ministre",
  "adjoint au maire",
  "premier adjoint à la mairie",
  "ancien sénateur",
  "sénateur",
  "ancien premier ministre"
];

// Words that indicate the start of specific details (not part of base function)
const STOP_WORDS = [
  "de la", "du", "des", "de l'", "d'",
  "pour", "à", "au", "aux", "en",
  "chargé", "chargée",
];

// Extract the base function using stop-word approach with exceptions
const extractBaseFunction = (fonction: string): string => {
  if (!fonction) return "";
  
  // Clean up the input
  let cleaned = fonction.split(' ').map((word) => {
return word.trim()
    .toLowerCase()
    .replace(/[.,;:!?]+$/g, '') 
    .replace(/\s+/g, ' ')
    .replace(/trice/g, 'teur')
     .replace(/ée/g, "é")
     .replace(/te/g, "t")
  }).join(' ');
  // let cleaned = fonction
  //   .trim()
  //   .toLowerCase()
  //   .replace(/[.,;:!?]+$/g, '') // Remove trailing punctuation
  //   .replace(/\s+/g, ' '); // Normalize whitespace

  
  // Remove content in parentheses (like years)
  cleaned = cleaned.replace(/\s*\([^)]*\)/g, '');
  
  // Check if this matches a complete function exception
  for (const completeFunc of COMPLETE_FUNCTIONS) {
    const normalizedComplete = completeFunc.toLowerCase();
    
    // If the function starts with a complete function pattern, return it
    if (cleaned.startsWith(normalizedComplete) || cleaned.includes(normalizedComplete) || normalizedComplete.includes(cleaned)) {
      return completeFunc;
    }
    
    // Special case: if complete function contains "de/du" but our input doesn't have the rest
    // Example: "maire de paris" should match "maire de" exception
    //président 
 
  }
  
  // No exception matched, apply stop-word logic
  let result = cleaned;
  
  // Find the first occurrence of any stop-word pattern
  for (const stopWord of STOP_WORDS) {
    const pattern = new RegExp(`\\s+${stopWord.replace(/'/g, "['']")}\\s+`, 'i');
    const match = result.match(pattern);
    
    if (match && match.index !== undefined) {
      // Check if this stop word is followed by a number or specific detail
      const beforeStop = result.substring(0, match.index);
      const afterStop = result.substring(match.index + match[0].length);
      
      // If after stop word we have numbers, locations, or specific details, cut here
      if (/^\d|^[A-Z]|^(région|département|ville|commune|arrondissement)/.test(afterStop)) {
        result = beforeStop;
        break;
      }
    }
  }
  
  // Remove "entre les..." and everything after
  result = result.replace(/\s+entre\s+.*/i, '');
  
  return result.trim();
};

// Normalize for comparison (handle gender, accents, etc.)
const normalizeForComparison = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/\s+/g, ' ')
    .replace(/ère$/i, 'er')
    .replace(/ère\s/i, 'er ')
    .replace(/rice$/i, 'eur')
    .replace(/rice\s/i, 'eur ')
    .replace(/te$/i, 't')
    .replace(/te\s/i, 't ')
    .replace(/ée$/i, 'e')
    .replace(/ée\s/i, 'e ')
    .replace(/[']/g, "'") // Normalize apostrophes
    .trim();
};

// Clean and capitalize for display
const cleanFunction = (fonction: string): string => {
  if (!fonction) return "";
  
  return fonction
    .split(' ')
    .map((word, index) => {
      const lower = word.toLowerCase();
      // Keep particles lowercase unless it's the first word
      if (index > 0 && ['de', 'la', 'le', 'du', 'des', "d'", 'l', 'au', 'aux'].includes(lower)) {
        return lower;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ')
    .replace(/\sd'/g, " d'")
    .replace(/\sD'/g, " d'");
};

export function FunctionFilter({
  urlParams,
  functionsList,
}: FunctionFilterProps) {
  const { filters, updateFilter, removeFilter, clearFilters } = useSearchFilters();
  const router = useRouter();
 
  const handleFilterChange = (filterType: string, values: any) => {
    updateFilter(filterType as any, values);
    
    // Build new URL with updated filters
    const params = new URLSearchParams();  
    
    if (filterType === 'functions' && values.length > 0) {
      params.set('function', values[0]);
    }
    
    router.push(`/citations?${params.toString()}`);
  };

  const toggleFunction = (func: string) => {
    const newSelected = filters.functions.includes(func) 
      ? filters.functions.filter((f) => f !== func) 
      : [...filters.functions, func];
    
    updateFilter('functions', newSelected);
  };

  // Extract base functions and deduplicate
  const filteredFunctions = (() => {
    const seen = new Map<string, string>(); // normalized base -> cleaned display
    
    functionsList.forEach(func => {
      const baseFunc = extractBaseFunction(func);
      const normalized = normalizeForComparison(baseFunc);
      
      // Only add if we haven't seen this normalized base function before
      if (!seen.has(normalized) && normalized) {
        seen.set(normalized, cleanFunction(baseFunc));
      }
    });
    
    // Return unique functions, sorted alphabetically
    return Array.from(seen.values()).sort((a, b) => a.localeCompare(b, 'fr'));
  })();

  return (
    <div className="space-y-3 w-fit">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-md flex items-center justify-start gap-2">
          <BriefcaseBusiness size={18} />Fonction
        </h3>
        
        {filters.functions.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="h-6 text-xs"
          >
            Tout effacer
          </Button>
        )}
      </div>

      {/* Dropdown for selecting functions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            <BriefcaseBusiness className="mr-2 h-4 w-4" />
            Sélectionner des fonctions
            {filters.functions.length > 0 && (
              <span className="ml-auto bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                {filters.functions.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto">
          <DropdownMenuGroup>
            {filteredFunctions.map((func, i) => (
              <DropdownMenuCheckboxItem 
                key={`${func}-${i}`}
                checked={filters.functions.includes(func)}
                onCheckedChange={() => toggleFunction(func)}
                className="cursor-pointer"
              >
                {func}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Display selected functions as tags */}
      {filters.functions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {filters.functions.map((func) => (
            <Tag 
              key={func} 
              size="sm" 
              variant="solid" 
              className="flex items-center gap-2 animate-in fade-in duration-200"
            >
              {func}
              <button
                onClick={() => removeFilter("functions", func)}
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