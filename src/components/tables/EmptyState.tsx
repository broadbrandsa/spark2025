interface EmptyStateProps {
  message: string;
  description?: string;
}

export function EmptyState({ message, description }: EmptyStateProps) {
  return (
    <div className="rounded border border-gray-200 p-8 text-center">
      <p className="text-gray-700">{message}</p>
      {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
    </div>
  );
}
