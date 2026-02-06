import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
