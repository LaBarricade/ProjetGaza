'use client';

import { Quote } from "@/components/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      {/* NavItems (desktop only) */}
      <div className="hidden md:flex gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.href}
              asChild
              variant={isActive ? "default" : "ghost"}
              className="shrink-0"
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          );
        })}
      </div>

      {/* Input (toujours centré) */}
      {onResults && (
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-xs md:max-w-sm">
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

      {/* Wiki bouton (desktop) */}
      <div className="ml-auto hidden md:block">
        <Button asChild variant="outline" className="shrink-0">
          <Link
            href="https://fr.wikipedia.org/wiki/G%C3%A9nocide_%C3%A0_Gaza"
            target="_blank"
          >
            Documentation externe
          </Link>
        </Button>
      </div>

      {/* Dropdown menu (mobile only) */}
      <div className="ml-auto md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <DropdownMenuItem key={item.href} asChild>
                  <Link
                    href={item.href}
                    className={`w-full ${
                      isActive ? "font-semibold text-primary" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuItem asChild>
              <Link
                href="https://fr.wikipedia.org/wiki/G%C3%A9nocide_%C3%A0_Gaza"
                target="_blank"
              >
                Documentation externe
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
