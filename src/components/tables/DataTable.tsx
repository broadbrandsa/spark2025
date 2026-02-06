import { ReactNode } from "react";
import { EmptyState } from "./EmptyState";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T extends object> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  emptyMessage?: string;
}

export function DataTable<T extends object>({
  data,
  columns,
  keyField,
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className="overflow-x-auto rounded border border-gray-200">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-4 py-3 text-sm font-medium text-gray-700 ${
                  alignClasses[column.align || "left"]
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={String((row as Record<string, unknown>)[keyField as string])} className="border-b border-gray-100">
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={`px-4 py-3 text-sm ${alignClasses[column.align || "left"]}`}
                >
                  {column.render
                    ? column.render(row)
                    : String((row as Record<string, unknown>)[column.key as string] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
