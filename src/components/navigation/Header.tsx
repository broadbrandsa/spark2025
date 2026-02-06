import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="border-b border-[var(--accent-soft)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logos/spark-logo.webp" alt="SPARK Schools" width={120} height={36} priority />
          <Image src="/logos/broadbrand.png" alt="Broadbrand" width={120} height={36} priority />
        </Link>
        <nav className="flex gap-6">
          <Link href="/" className="text-p2 text-[var(--foreground)] hover:text-[var(--accent-pink)]">
            Overview
          </Link>
          <Link href="/schools" className="text-p2 text-[var(--foreground)] hover:text-[var(--accent-pink)]">
            Schools
          </Link>
        </nav>
      </div>
    </header>
  );
}
