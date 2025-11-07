'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export function NavItem({
  href,
  label,
  children,
  submenu
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  submenu?: Array<{ href: string; label: string; icon: React.ReactNode }>;
}) {
  const pathname = usePathname();
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const isActive = pathname === href || (submenu && submenu.some(item => pathname === item.href));

  if (submenu) {
    return (
      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
              className={clsx(
                'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                {
                  'bg-accent text-black': isActive
                }
              )}
            >
              {children}
              <span className="sr-only">{label}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>

        {isSubmenuOpen && (
          <div className="absolute left-full top-0 ml-2 bg-background border rounded-lg shadow-lg py-2 min-w-[140px] z-50">
            {submenu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent transition-colors',
                  {
                    'bg-accent text-black': pathname === item.href
                  }
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={clsx(
            'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
            {
              'bg-accent text-black': pathname === href
            }
          )}
        >
          {children}
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
