import type { ReactNode } from "react";

interface ReportSectionProps {
  children: ReactNode;
  className?: string;
}

export function ReportSection({ children, className = "" }: ReportSectionProps) {
  return <section className={`report-section ${className}`.trim()}>{children}</section>;
}
