'use client';

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export function TopBar() {
  const pathname = usePathname();
  const navItems = [
    { href: "/actualites", label: "Actualités" },
    { href: "/personnalites", label: "Politiciens" },
    { href: "/citations", label: "Citations" },
    { href: process.env.NEXT_PUBLIC_FORM_URL || "", label: "Contribuer" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="sticky top-0 w-full flex items-center justify-between gap-4 bg-white shadow-md z-50">
      {/* Logo + Titre */}
      <div className="flex items-center gap-3 p-4">
        {/* Logo placeholder */}

        <Link href={'/'}>
          <Image
            src="/logo-with-text.png"
            alt="Logo de La boussole de Gaza"
            width={120}
            height={50}
          />
        </Link>
      </div>

      {/* Navigation (desktop) */}
      <div className="hidden md:flex items-center gap-3 ml-auto m-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              className={`shrink-0 text-gray-700 border border-transparent hover:border-gray-300 hover:bg-transparent transition-colors duration-200 ${
                isActive ? "font-semibold text-primary" : ""
              }`}
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          );
        })}

        {/* <Button
          asChild
          variant="ghost"
          className="shrink-0 text-gray-700 border border-transparent hover:border-gray-300 hover:bg-transparent transition-colors duration-200"
        >
          <Link
            href="https://fr.wikipedia.org/wiki/G%C3%A9nocide_%C3%A0_Gaza"
            target="_blank"
          >
            Documentation externe
          </Link>
        </Button> */}
      </div>

      {/* Dropdown menu (mobile) */}
      <div className="ml-auto md:hidden mr-4">
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
            {/* <DropdownMenuItem asChild>
              <Link
                href="https://fr.wikipedia.org/wiki/G%C3%A9nocide_%C3%A0_Gaza"
                target="_blank"
              >
                Documentation externe
              </Link>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
