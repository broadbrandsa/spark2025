interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <h2>{title}</h2>
      {subtitle && <p className="mt-1 text-p2 text-gray-600">{subtitle}</p>}
    </div>
  );
}
