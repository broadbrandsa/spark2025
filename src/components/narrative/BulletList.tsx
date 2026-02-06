interface BulletListProps {
  items: string[];
}

export function BulletList({ items }: BulletListProps) {
  return (
    <ul className="list-disc space-y-2 pl-6">
      {items.map((item, index) => (
        <li key={index} className="text-gray-700">
          {item}
        </li>
      ))}
    </ul>
  );
}
