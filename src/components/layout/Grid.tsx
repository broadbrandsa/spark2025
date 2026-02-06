import { ReactNode } from "react";

interface GridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6;
}

const columnClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
};

export function Grid({ children, columns = 3 }: GridProps) {
  return <div className={`grid gap-4 ${columnClasses[columns]}`}>{children}</div>;
}
