"use client";

import React from "react";
import TableSkeleton from "./TableSkeleton";

interface Column {
  key: string;
  label: string;
}

interface ReusableTableProps {
  columns: Column[];
  data?: any[];
  isLoading?: boolean;
  error?: string | null;
  renderActions?: (row: any) => React.ReactNode; // Action buttons from parent
}

const ReusableTable: React.FC<ReusableTableProps> = ({
  columns,
  data = [],
  isLoading = false,
  error,
  renderActions,
}) => {
  if (isLoading) return <TableSkeleton columns={columns.length} rows={5} />;

  if (error) return <p className="text-center py-4 text-red-500">{error}</p>;
  if (!data || data.length === 0)
    return <p className="text-center py-4">No data available</p>;

  const getStatusBadge = (status: string) => {
    const base = "px-4 py-2 rounded-lg text-sm font-normal";
    if (status === "Active")
      return (
        <span className={`${base} bg-[#52C41A1A] text-[#47AD15]`}>
          {status}
        </span>
      );
    if (status === "Inactive")
      return (
        <span className={`${base} bg-[#FF00001A] text-[#FF4D4F]`}>
          {status}
        </span>
      );
    return <span className={`${base}`}>{status}</span>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="text-white/70">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="p-2 text-left border-b-2 border-gray-700"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="">
              {columns.map((col) => (
                <td key={col.key} className="p-2 text-white">
                  {col.key === "status"
                    ? getStatusBadge(row[col.key])
                    : col.key === "action" && renderActions
                      ? renderActions(row)
                      : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReusableTable;
