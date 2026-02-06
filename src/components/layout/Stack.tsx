import { ReactNode } from "react";

interface StackProps {
  children: ReactNode;
  gap?: "sm" | "md" | "lg";
}

const gapClasses = {
  sm: "space-y-2",
  md: "space-y-4",
  lg: "space-y-8",
};

export function Stack({ children, gap = "md" }: StackProps) {
  return <div className={gapClasses[gap]}>{children}</div>;
}
