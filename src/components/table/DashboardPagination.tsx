import { ChevronLeft, ChevronRight } from "lucide-react";

type DashboardPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

function getVisiblePages(currentPage: number, totalPages: number) {
  const safeTotalPages = Math.max(1, totalPages);

  if (safeTotalPages <= 3) {
    return Array.from({ length: safeTotalPages }, (_, index) => index + 1);
  }

  const start = Math.max(1, Math.min(currentPage - 1, safeTotalPages - 2));
  return [start, start + 1, start + 2];
}

export default function DashboardPagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: DashboardPaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages);
  const visiblePages = getVisiblePages(safeCurrentPage, safeTotalPages);

  return (
    <div
      className={`mt-6 flex items-center justify-end gap-3 text-base font-semibold text-[#5f6572] ${className ?? ""}`}
    >
      <button
        aria-label="Previous page"
        onClick={() => onPageChange(Math.max(1, safeCurrentPage - 1))}
        disabled={safeCurrentPage === 1}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f8e8f0] text-[#e7185d] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft size={18} />
      </button>

      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`inline-flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2 ${
            safeCurrentPage === page
              ? "bg-[#e7185d] text-white"
              : "text-[#5f6572]"
          }`}
        >
          {page}
        </button>
      ))}

      {safeTotalPages > 3 && <span className="px-1">...</span>}
      <button
        onClick={() => onPageChange(safeTotalPages)}
        disabled={safeCurrentPage === safeTotalPages}
        className="inline-flex h-10 min-w-[40px] items-center justify-center rounded-xl px-3 text-[#5f6572] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {safeTotalPages}
      </button>

      <button
        aria-label="Next page"
        onClick={() =>
          onPageChange(Math.min(safeTotalPages, safeCurrentPage + 1))
        }
        disabled={safeCurrentPage >= safeTotalPages}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#fff2e5] text-[#ff9c43] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
