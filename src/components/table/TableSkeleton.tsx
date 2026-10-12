"use client";

type TableSkeletonProps = {
  columns: number;
  rows?: number;
  className?: string;
};

export default function TableSkeleton({
  columns,
  rows = 5,
  className = "",
}: TableSkeletonProps) {
  return (
    <div className={className}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b border-[#e8eaf0] text-left text-base font-medium text-[#545861]">
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="py-4 pr-4">
                  <div className="h-4 w-24 rounded bg-[#ececf2] animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-[#f1f1f5]">
                {Array.from({ length: columns }).map((_, columnIndex) => (
                  <td key={columnIndex} className="py-5 pr-4">
                    <div
                      className={`h-4 rounded bg-[#edf0f5] animate-pulse ${
                        columnIndex === columns - 1
                          ? "ml-auto w-20"
                          : "w-full max-w-[180px]"
                      }`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
