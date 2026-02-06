import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-[var(--accent-soft)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-6">
        <div className="flex items-center gap-3">
          <Image src="/logos/spark-logo.webp" alt="SPARK Schools" width={96} height={30} />
          <Image src="/logos/broadbrand.png" alt="Broadbrand" width={96} height={30} />
        </div>
        <p className="text-p2 text-center text-[var(--foreground)]">
          SPARK Schools Marketing Performance Review • Jan 2025 – Jan 2026
        </p>
      </div>
    </footer>
  );
}
