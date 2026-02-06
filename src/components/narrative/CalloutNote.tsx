import { ReactNode } from "react";

interface CalloutNoteProps {
  type?: "info" | "highlight" | "warning";
  title?: string;
  children: ReactNode;
}

export function CalloutNote({ type = "info", title, children }: CalloutNoteProps) {
  // Neutral styling for now - color logic to be added with final designs
  const borderClass = "border-gray-300";
  const bgClass = "bg-gray-50";

  return (
    <div className={`rounded border-l-4 p-4 ${borderClass} ${bgClass}`}>
      {title && <p className="mb-2 font-medium">{title}</p>}
      <div className="text-sm text-gray-700">{children}</div>
    </div>
  );
}
