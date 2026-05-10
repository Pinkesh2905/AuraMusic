"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Discover", href: "/discover" },
  { label: "Search", href: "/search" },
  { label: "Library", href: "/library" },
  { label: "Sonic DNA", href: "/dna" },
  { label: "Time Capsules", href: "/capsules" },
];

export function LeftNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-6 mb-8">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={cn(
              "text-sm font-semibold tracking-wide transition-colors",
              isActive ? "text-white" : "text-white/40 hover:text-white/80"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
