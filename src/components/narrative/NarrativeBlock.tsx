import { ReactNode } from "react";

interface NarrativeBlockProps {
  title?: string;
  children: ReactNode;
}

export function NarrativeBlock({ title, children }: NarrativeBlockProps) {
  return (
    <div className="prose max-w-none">
      {title && <h3 className="mb-4 text-xl font-semibold">{title}</h3>}
      <div className="space-y-4 text-gray-700">{children}</div>
    </div>
  );
}
