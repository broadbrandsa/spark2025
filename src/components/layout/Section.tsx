import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  id?: string;
}

export function Section({ children, id }: SectionProps) {
  return (
    <section id={id} className="py-8">
      {children}
    </section>
  );
}
