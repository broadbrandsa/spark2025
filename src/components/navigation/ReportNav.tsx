import Image from "next/image";
import Link from "next/link";

export function ReportNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#2b0430] bg-[#2B0430]">
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/Logos/SPARK logo.webp" alt="Spark Logo" width={124} height={32} className="h-12 w-auto" priority />
            <Image
              src="/Logos/broadbrand.png"
              alt="Broadbrand Logo"
              width={124}
              height={32}
              className="h-8 w-auto brightness-0 invert"
              priority
            />
          </Link>
          <div className="mx-2 h-6 w-px bg-white/40" />
          <p className="text-p2 font-bold uppercase tracking-widest text-white">2025 Performance Report</p>
        </div>

        <div className="flex items-center gap-6 text-p2 font-semibold">
          <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-tight text-white/70">
            <span>Confidential Board Deck</span>
            <span>•</span>
            <span>Jan 2026 Update</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
