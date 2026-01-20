'use client'

import {Input} from "@/components/ui/input";
import {Search} from "lucide-react";
import {useState} from "react";

export default function SearchInput({runSearch}: {runSearch: (q: string) => void}) {
  const [query, setQuery] = useState("");

  return (
    <div className="flex w-full mt-4 justify-center">
      <div className="relative w-full md:max-w-md">
        <Input
          type="text"
          placeholder="Rechercher un politicien, un tag, ou un mot-clé..."
          className="bg-white pr-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && runSearch(query)}
        />
        <Search className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"
                onClick={() => runSearch(query)}/>
      </div>
    </div>

  );

}