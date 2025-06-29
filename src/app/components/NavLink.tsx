'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  label: string;
}

export default function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-green-100 text-green-800 font-semibold' : 'text-gray-600 hover:text-green-700'}`}
    >
      {label}
    </Link>
  );
}
