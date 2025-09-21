'use client';

import { Quote } from "@/components/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type SearchBarProps = {
  onResults?: (results: Quote[] | null) => void; // facultatif
};

export function SearchBar({ onResults }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Citations" },
    { href: "/personnalites", label: "Personnalités" },
  ];

  useEffect(() => {
    if (!onResults) return; // si pas de callback, on ne fait rien

    const timeout = setTimeout(() => {
      if (query.length === 0) {
        onResults(null);
        return;
      }
      
      const fetchData = async () => {
        const res = await fetch(`/api/baserow?search=${encodeURIComponent(query)}`);
        const data = await res.json();
        onResults(data?.results || []);
      };

      fetchData();
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, onResults]);

  return (
    <div className="sticky top-0 w-full flex items-center gap-4 p-4 bg-white shadow-md z-50">
      <div className="flex gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (<Button
              key={item.href}
              asChild
              variant={isActive ? "default" : "ghost"}
              className="shrink-0"
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>)
        })}
      </div>

      {/* On n'affiche l'input que si onResults est défini */}
      {onResults && (
        <div className="flex-1 flex justify-center">
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Rechercher"
              className="pr-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
        </div>
      )}

      {/* Bouton wiki à droite */}
      <div className="ml-auto">
        <Button asChild variant="outline" className="shrink-0">
          <Link href="https://fr.wikipedia.org/wiki/G%C3%A9nocide_%C3%A0_Gaza" target="_blank">
            Documentation externe
          </Link>
        </Button>
      </div>
    </div>
  );
}
