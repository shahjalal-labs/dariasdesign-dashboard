"use client";

import { Input } from "@/components/ui/input";
import {
  useCreateDiscountMutation,
  useDeleteDiscountMutation,
  useGetALlDiscountListQuery,
  useLazyDiscountDetailsQuery,
  useUpdateDiscountMutation,
} from "@/redux/api/admin/discountApi";
import { Copy, Eye, Pencil, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DashboardPagination from "./DashboardPagination";
import TableSkeleton from "./TableSkeleton";

type DiscountItem = {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type DiscountMeta = {
  page: number;
  limit: number;
  totalCount: number;
  totalPage: number;
};

type DiscountListResponse = {
  success: boolean;
  message: string;
  result: {
    meta: DiscountMeta;
    discounts: DiscountItem[];
  };
};

type DiscountDetailsResponse = {
  success: boolean;
  message: string;
  result: DiscountItem;
};

type DiscountFormState = {
  title: string;
  description: string;
  code: string;
  discount: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

type ModalMode = "create" | "edit";

const rowsPerPage = 10;

const tableHeaders = [
  "Discount title",
  "Description",
  "Discount code",
  "Discount",
  "Start date",
  "End Date",
  "Status",
  "Action",
];

const emptyFormState: DiscountFormState = {
  title: "",
  description: "",
  code: "",
  discount: "",
  startDate: "",
  endDate: "",
  isActive: true,
};

function toInputDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function toDisplayDate(value: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function DiscountManagement() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDiscountId, setSelectedDiscountId] = useState<string | null>(
    null,
  );
  const [formState, setFormState] = useState<DiscountFormState>(emptyFormState);

  const {
    data: listResponse,
    isFetching: isListFetching,
    refetch,
  } = useGetALlDiscountListQuery(
    {
      page,
      limit: rowsPerPage,
      search: search.trim() || undefined,
    },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const [
    triggerDetails,
    { data: detailsResponse, isFetching: isDetailsFetching },
  ] = useLazyDiscountDetailsQuery();

  const [createDiscount, { isLoading: isCreating }] =
    useCreateDiscountMutation();
  const [updateDiscount, { isLoading: isUpdating }] =
    useUpdateDiscountMutation();
  const [deleteDiscount, { isLoading: isDeleting }] =
    useDeleteDiscountMutation();

  const discounts =
    (listResponse as DiscountListResponse | undefined)?.result?.discounts ?? [];
  const meta = (listResponse as DiscountListResponse | undefined)?.result?.meta;

  const totalPages = Math.max(1, meta?.totalPage ?? 1);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const detailsItem = (detailsResponse as DiscountDetailsResponse | undefined)
    ?.result;

  const openCreateModal = () => {
    setMode("create");
    setEditingId(null);
    setFormState(emptyFormState);
    setIsFormOpen(true);
  };

  const openEditModal = (item: DiscountItem) => {
    setMode("edit");
    setEditingId(item.id);
    setFormState({
      title: item.title,
      description: item.description,
      code: item.code,
      discount: String(item.discount),
      startDate: toInputDate(item.startDate),
      endDate: toInputDate(item.endDate),
      isActive: item.isActive,
    });
    setIsFormOpen(true);
  };

  const openDetailsModal = async (id: string) => {
    setSelectedDiscountId(id);
    try {
      await triggerDetails(id).unwrap();
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError?.data?.message || "Failed to load discount details");
    }
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const closeDetailsModal = () => {
    setSelectedDiscountId(null);
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Discount code copied");
    } catch {
      toast.error("Could not copy discount code");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this discount?",
    );
    if (!confirmed) return;

    try {
      const response = await deleteDiscount(id).unwrap();
      const message = (response as { message?: string })?.message;
      toast.success(message || "Discount deleted successfully");
      if (selectedDiscountId === id) {
        closeDetailsModal();
      }
      refetch();
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError?.data?.message || "Failed to delete discount");
    }
  };

  const handleToggleStatus = async (item: DiscountItem) => {
    try {
      const payload = {
        title: item.title,
        description: item.description,
        code: item.code,
        discount: item.discount,
        startDate: item.startDate,
        endDate: item.endDate,
        isActive: !item.isActive,
      };

      const response = await updateDiscount({
        id: item.id,
        data: payload,
      }).unwrap();
      const message = (response as { message?: string })?.message;
      toast.success(message || "Discount status updated");
      refetch();
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(
        apiError?.data?.message || "Failed to update discount status",
      );
    }
  };

  const submitForm = async () => {
    const title = formState.title.trim();
    const description = formState.description.trim();
    const code = formState.code.trim().toUpperCase();
    const discountValue = Number(formState.discount);

    if (
      !title ||
      !description ||
      !code ||
      !formState.startDate ||
      !formState.endDate
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (
      Number.isNaN(discountValue) ||
      discountValue <= 0 ||
      discountValue > 100
    ) {
      toast.error("Discount must be a number between 1 and 100");
      return;
    }

    const start = new Date(formState.startDate);
    const end = new Date(formState.endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      toast.error("Please provide valid start and end dates");
      return;
    }

    if (end.getTime() < start.getTime()) {
      toast.error("End date cannot be earlier than start date");
      return;
    }

    const payload = {
      title,
      description,
      code,
      discount: discountValue,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      ...(mode === "edit" ? { isActive: formState.isActive } : {}),
    };

    try {
      if (mode === "create") {
        const response = await createDiscount(payload).unwrap();
        const message = (response as { message?: string })?.message;
        toast.success(message || "Discount created successfully");
        setPage(1);
      } else {
        if (!editingId) return;
        const response = await updateDiscount({
          id: editingId,
          data: payload,
        }).unwrap();
        const message = (response as { message?: string })?.message;
        toast.success(message || "Discount updated successfully");
      }

      closeFormModal();
      refetch();
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError?.data?.message || "Failed to submit discount");
    }
  };

  return (
    <>
      <section className="rounded-3xl border border-[#ececf2] bg-white px-4 py-5 shadow-sm md:px-6 md:py-6">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-[34px] font-semibold leading-none text-[#25252a]">
            Discount Code
          </h1>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[290px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b0b4be]" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search"
                className="h-[40px] rounded-xl border-[#d8dde6] bg-white pl-11 text-[#30303a] placeholder:text-[#adb3bf]"
              />
            </div>

            <button
              onClick={openCreateModal}
              className="h-10 rounded-xl bg-[#e7185d] px-6 text-base font-medium text-white transition-opacity hover:opacity-90"
            >
              + Create New Discount
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isListFetching && discounts.length === 0 ? (
            <TableSkeleton columns={8} rows={5} className="min-w-[1180px]" />
          ) : (
            <table className="w-full min-w-[1180px]">
              <thead>
                <tr className="border-b border-[#e8eaf0] text-left text-base font-medium text-[#545861]">
                  {tableHeaders.map((header) => (
                    <th key={header} className="py-4 pr-4 last:text-right">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {discounts.map((item) => (
                  <tr key={item.id} className="text-base text-[#2f3138]">
                    <td className="py-5 pr-4">{item.title}</td>
                    <td className="px-4 py-5 text-[#5f6572]">
                      <span className="block max-w-[240px] truncate">
                        {item.description}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-[#5f6572]">
                      <button
                        onClick={() => handleCopyCode(item.code)}
                        className="inline-flex items-center gap-3"
                      >
                        {item.code}
                        <Copy size={18} className="text-[#5b6270]" />
                      </button>
                    </td>
                    <td className="px-4 py-5 text-[#5f6572]">
                      {item.discount}%
                    </td>
                    <td className="px-4 py-5 text-[#5f6572]">
                      {toDisplayDate(item.startDate)}
                    </td>
                    <td className="px-4 py-5 text-[#5f6572]">
                      {toDisplayDate(item.endDate)}
                    </td>
                    <td className="px-4 py-5">
                      <button
                        aria-label="Toggle discount status"
                        disabled={isUpdating}
                        onClick={() => handleToggleStatus(item)}
                        className={`relative inline-flex h-8 w-[60px] items-center rounded-full transition-colors ${
                          item.isActive ? "bg-[#e7185d]" : "bg-[#f6dfe8]"
                        } ${isUpdating ? "opacity-60" : ""}`}
                      >
                        <span
                          className={`absolute inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#ff6d7a] shadow-sm transition-all ${
                            item.isActive ? "left-[30px]" : "left-1"
                          }`}
                        >
                          <span className="text-[10px] leading-none">|||</span>
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex justify-end gap-3 text-[#5b6270]">
                        <button
                          aria-label="View discount"
                          onClick={() => openDetailsModal(item.id)}
                          className="text-[#ffb11b] transition-opacity hover:opacity-80"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          aria-label="Edit discount"
                          onClick={() => openEditModal(item)}
                          className="text-[#2ea0ff] transition-opacity hover:opacity-80"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          aria-label="Delete discount"
                          disabled={isDeleting}
                          onClick={() => handleDelete(item.id)}
                          className="text-[#ff5f63] transition-opacity hover:opacity-80 disabled:opacity-60"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!isListFetching && discounts.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-base text-[#8f95a2]"
                    >
                      No discounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <DashboardPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </section>

      {selectedDiscountId && (
        <DiscountDetailsModal
          item={detailsItem}
          loading={isDetailsFetching}
          onClose={closeDetailsModal}
          onEdit={() => {
            if (!detailsItem) return;
            closeDetailsModal();
            openEditModal(detailsItem);
          }}
          onDelete={() => {
            if (!selectedDiscountId) return;
            handleDelete(selectedDiscountId);
          }}
          onCopy={handleCopyCode}
        />
      )}

      {isFormOpen && (
        <DiscountFormModal
          mode={mode}
          formState={formState}
          setFormState={setFormState}
          onClose={closeFormModal}
          onSubmit={submitForm}
          loading={isCreating || isUpdating}
        />
      )}
    </>
  );
}

function DiscountDetailsModal({
  item,
  loading,
  onClose,
  onEdit,
  onDelete,
  onCopy,
}: {
  item?: DiscountItem;
  loading: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: (code: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#161a23]/40" onClick={onClose} />

      <div className="relative z-10 flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#dce1ea] bg-white shadow-2xl">
        <div className="border-b border-[#edf0f5] px-5 py-4 md:px-6">
          <h3 className="font-display text-2xl font-semibold text-[#1f1f24] md:text-3xl">
            Discount Details
          </h3>
        </div>

        <div className="max-h-[68vh] overflow-y-auto px-5 py-4 md:px-6">
          {loading && (
            <p className="py-8 text-center text-[#6c7380]">Loading...</p>
          )}

          {!loading && !item && (
            <p className="py-8 text-center text-[#6c7380]">No details found.</p>
          )}

          {!loading && item && (
            <div className="space-y-1">
              <DetailRow label="Discount title" value={item.title} />
              <DetailRow label="Description" value={item.description} />
              <DetailRow
                label="Discount code"
                value={
                  <button
                    onClick={() => onCopy(item.code)}
                    className="inline-flex items-center gap-2"
                  >
                    {item.code}
                    <Copy size={16} className="text-[#5b6270]" />
                  </button>
                }
              />
              <DetailRow label="Discount" value={`${item.discount}%`} />
              <DetailRow
                label="Start date"
                value={toDisplayDate(item.startDate)}
              />
              <DetailRow label="End date" value={toDisplayDate(item.endDate)} />
              <DetailRow
                label="Status"
                value={
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      item.isActive
                        ? "bg-[#e8f7ef] text-[#1e9151]"
                        : "bg-[#f5f5f5] text-[#666]"
                    }`}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                }
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[#edf0f5] px-5 py-4 md:px-6">
          <button
            onClick={onClose}
            className="h-11 min-w-[96px] rounded-xl border border-[#ef2d73] px-5 text-base font-medium text-[#ef2d73]"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            disabled={!item}
            className="h-11 min-w-[96px] rounded-xl border border-[#ef2d73] px-5 text-base font-medium text-[#ef2d73] disabled:opacity-60"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            disabled={!item}
            className="h-11 min-w-[110px] rounded-xl bg-[#e7185d] px-5 text-base font-medium text-white disabled:opacity-60"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function DiscountFormModal({
  mode,
  formState,
  setFormState,
  onClose,
  onSubmit,
  loading,
}: {
  mode: ModalMode;
  formState: DiscountFormState;
  setFormState: React.Dispatch<React.SetStateAction<DiscountFormState>>;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#161a23]/40" onClick={onClose} />

      <div className="relative z-10 flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#dce1ea] bg-white shadow-2xl">
        <div className="border-b border-[#edf0f5] px-5 py-4 md:px-6">
          <h3 className="font-display text-2xl font-semibold text-[#1f1f24] md:text-3xl">
            {mode === "create" ? "Create New Discount" : "Edit Discount"}
          </h3>
        </div>

        <div className="max-h-[68vh] overflow-y-auto px-5 py-5 md:px-6">
          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-base font-medium text-[#22252d]">
                Discount title
              </span>
              <input
                value={formState.title}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }))
                }
                placeholder="Enter discount title"
                className="h-12 w-full rounded-xl border border-[#d8dde6] px-4 text-base text-[#22252d] outline-none focus:border-[#c8ced9]"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-base font-medium text-[#22252d]">
                Description
              </span>
              <textarea
                value={formState.description}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                rows={4}
                placeholder="Enter description"
                className="w-full rounded-xl border border-[#d8dde6] px-4 py-3 text-base text-[#22252d] outline-none focus:border-[#c8ced9]"
              />
            </label>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-base font-medium text-[#22252d]">
                  Discount code
                </span>
                <input
                  value={formState.code}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      code: event.target.value,
                    }))
                  }
                  placeholder="e.g. OFFER10"
                  className="h-12 w-full rounded-xl border border-[#d8dde6] px-4 text-base text-[#22252d] outline-none focus:border-[#c8ced9]"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-base font-medium text-[#22252d]">
                  Discount (%)
                </span>
                <div className="relative">
                  <input
                    value={formState.discount}
                    type="number"
                    min="1"
                    max="100"
                    step="0.01"
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        discount: event.target.value,
                      }))
                    }
                    placeholder="10"
                    className="h-12 w-full rounded-xl border border-[#d8dde6] px-4 pr-10 text-base text-[#22252d] outline-none focus:border-[#c8ced9]"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-base text-[#a2a9b7]">
                    %
                  </span>
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-base font-medium text-[#22252d]">
                  Start Date
                </span>
                <input
                  type="date"
                  value={formState.startDate}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      startDate: event.target.value,
                    }))
                  }
                  className="h-12 w-full rounded-xl border border-[#d8dde6] px-4 text-base text-[#22252d] outline-none focus:border-[#c8ced9]"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-base font-medium text-[#22252d]">
                  End Date
                </span>
                <input
                  type="date"
                  value={formState.endDate}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      endDate: event.target.value,
                    }))
                  }
                  className="h-12 w-full rounded-xl border border-[#d8dde6] px-4 text-base text-[#22252d] outline-none focus:border-[#c8ced9]"
                />
              </label>
            </div>

            {mode === "edit" && (
              <label className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  checked={formState.isActive}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      isActive: event.target.checked,
                    }))
                  }
                  className="h-4 w-4"
                />
                <span className="text-sm text-[#22252d]">Active discount</span>
              </label>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[#edf0f5] px-5 py-4 md:px-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="h-11 min-w-[96px] rounded-xl border border-[#ef2d73] px-5 text-base font-medium text-[#ef2d73] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="h-11 min-w-[130px] rounded-xl bg-[#e7185d] px-5 text-base font-medium text-white disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : mode === "create"
                ? "Submit"
                : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 items-start gap-1 border-b border-[#eceff4] py-3 md:grid-cols-12 md:items-center md:gap-4">
      <p className="md:col-span-4 text-sm font-medium text-[#7a8190]">
        {label}
      </p>
      <div className="md:col-span-8 text-sm text-[#1e232b] md:text-right">
        {value}
      </div>
    </div>
  );
}
