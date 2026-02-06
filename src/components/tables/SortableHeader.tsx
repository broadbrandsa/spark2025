interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentSort?: string;
  direction?: "asc" | "desc";
  onSort?: (key: string) => void;
}

export function SortableHeader({
  label,
  sortKey,
  currentSort,
  direction,
  onSort,
}: SortableHeaderProps) {
  const isActive = currentSort === sortKey;

  return (
    <button
      onClick={() => onSort?.(sortKey)}
      className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
    >
      {label}
      <span className="text-gray-400">
        {isActive && direction === "asc" && "↑"}
        {isActive && direction === "desc" && "↓"}
        {!isActive && "↕"}
      </span>
    </button>
  );
}
