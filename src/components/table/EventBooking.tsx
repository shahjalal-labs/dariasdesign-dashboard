"use client";

import { Input } from "@/components/ui/input";
import {
  useGetBookingDetailsQuery,
  useLazyGetAllEventBookingListQuery,
} from "@/redux/api/admin/eventApi";
import { Eye, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardPagination from "./DashboardPagination";
import TableSkeleton from "./TableSkeleton";

type Slot = {
  id: string;
  date: string;
  startTime?: string;
  endTime?: string;
};

type BookingListItem = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  paymentGateway: string;
  quantity: number;
  slot?: Slot;
};

type BookingDetail = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  paymentGateway: string;
  quantity: number;
  street?: string;
  city?: string;
  postalCode?: string;
  participants?: Array<{
    fullName: string;
    email?: string;
    phoneNumber?: string;
  }>;
  notes?: string;
  status?: string;
  slot?: Slot & { quantity?: number };
};

const rowsPerPage = 10;

const detailRows = [
  { key: "fullName", label: "User Name" },
  { key: "email", label: "Email Address" },
  { key: "phoneNumber", label: "Phone Number" },
  { key: "street", label: "Address" },
  { key: "paymentGateway", label: "Payment Method" },
  { key: "city", label: "City" },
  { key: "postalCode", label: "Zip Code" },
  { key: "slotDate", label: "Booking Desire Date Slot" },
  { key: "slotTime", label: "Booking Desire Time Slot" },
  { key: "quantity", label: "Number of Spots" },
  { key: "price", label: "Total Price" },
  { key: "status", label: "Payment Status" },
] as const;

export default function EventBooking() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );

  const [triggerList, { data: listData, isFetching: isListFetching }] =
    useLazyGetAllEventBookingListQuery();

  // fetch booking details when an id is selected
  const { data: bookingDetailsResult, isFetching: isDetailsFetching } =
    useGetBookingDetailsQuery(selectedBookingId ?? "", {
      skip: !selectedBookingId,
    });

  useEffect(() => {
    // initial fetch and fetch on page/search change
    triggerList({ page, limit: rowsPerPage, search: search || undefined });
  }, [page, search, triggerList]);

  useEffect(() => {
    if (listData?.result?.bookingList) {
      // map server items to local shape
      setBookings(
        listData.result.bookingList.map((b: any) => ({
          id: b.id,
          fullName: b.fullName,
          email: b.email,
          phoneNumber: b.phoneNumber,
          paymentGateway: b.paymentGateway,
          quantity: b.quantity,
          slot: b.slot,
        })),
      );
    } else {
      setBookings([]);
    }
  }, [listData]);

  const meta = listData?.result?.meta;
  const totalPages = Math.max(
    1,
    Number(meta?.totalPage ?? meta?.totalPages ?? 1),
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleDelete = (id: string) => {
    // for now remove locally; ideally call delete API then refetch
    setBookings((prev) => prev.filter((item) => item.id !== id));
  };

  const bookingDetails: BookingDetail | undefined =
    bookingDetailsResult?.result;

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return iso;
    }
  };

  return (
    <>
      <section className="rounded-3xl border border-[#ececf2] bg-white px-4 py-5 shadow-sm md:px-6 md:py-6">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-[34px] font-semibold leading-none text-[#25252a]">
            Booking List
          </h1>

          <div className="relative w-full sm:w-[290px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b0b4be]" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search"
              className="h-[50px] rounded-xl border-[#d8dde6] bg-white pl-11 text-[#30303a] placeholder:text-[#adb3bf]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isListFetching && bookings.length === 0 ? (
            <TableSkeleton columns={7} rows={5} className="min-w-[1050px]" />
          ) : (
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="border-b border-[#e8eaf0] text-left text-base font-medium text-[#545861]">
                  <th className="py-4 pr-4">User Name</th>
                  <th className="px-4 py-4">Email Address</th>
                  <th className="px-4 py-4">Phone Number</th>
                  <th className="px-4 py-4">Desire Date</th>
                  <th className="px-4 py-4">Payment Method</th>
                  <th className="px-4 py-4">Quantity</th>
                  <th className="px-4 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="text-base text-[#2f3138]">
                    <td className="py-5 pr-4">{booking.fullName}</td>
                    <td className="px-4 py-5 text-[#5f6572]">
                      {booking.email}
                    </td>
                    <td className="px-4 py-5 text-[#5f6572]">
                      {booking.phoneNumber}
                    </td>
                    <td className="px-4 py-5 text-[#5f6572]">
                      {formatDate(booking.slot?.date)}
                    </td>
                    <td className="px-4 py-5 text-[#5f6572]">
                      {booking.paymentGateway}
                    </td>
                    <td className="px-4 py-5 text-[#5f6572]">
                      {booking.quantity}
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex justify-end gap-3">
                        <button
                          aria-label="View booking"
                          onClick={() => setSelectedBookingId(booking.id)}
                          className="text-[#707784] transition-opacity hover:opacity-80"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          aria-label="Delete booking"
                          onClick={() => handleDelete(booking.id)}
                          className="text-[#ff5f63] transition-opacity hover:opacity-80"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {bookings.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-base text-[#8f95a2]"
                    >
                      No bookings found.
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

      {selectedBookingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedBookingId(null);
            }
          }}
        >
          <div className="absolute inset-0 bg-[#161a23]/40" />

          <div className="relative z-10 w-full max-w-[980px] rounded-[14px] border border-[#5f6877] bg-white px-6 pb-6 pt-5 shadow-2xl md:px-7 md:pb-7 md:pt-6">
            <h3 className="font-serif text-[48px] leading-none text-[#1f1f24] md:text-[52px]">
              Booking Details
            </h3>

            <div className="mt-5 border-t border-transparent max-h-[65vh] overflow-y-auto pr-4">
              {isDetailsFetching && (
                <p className="py-6 text-center">Loading...</p>
              )}

              {!isDetailsFetching && bookingDetails && (
                <>
                  {detailRows.map((row) => {
                    let value: any = undefined;

                    if (row.key === "slotDate")
                      value = formatDate(bookingDetails.slot?.date);
                    else if (row.key === "slotTime")
                      value = bookingDetails.slot
                        ? `${bookingDetails.slot.startTime ?? ""} - ${bookingDetails.slot.endTime ?? ""}`
                        : "";
                    else value = (bookingDetails as any)[row.key];

                    return (
                      <div
                        key={row.key}
                        className="grid grid-cols-12 items-center border-b border-[#eceff4] py-3"
                      >
                        <p className="col-span-5 text-[30px] text-[#9198a6]">
                          {row.label}
                        </p>
                        <div className="col-span-7 flex justify-end text-right text-[30px] text-[#1e232b]">
                          {row.key === "status" ? (
                            <span className="inline-flex min-w-[78px] items-center justify-center rounded-md bg-[#ebf5e9] px-3 py-1 text-[22px] text-[#62be49]">
                              {value}
                            </span>
                          ) : row.key === "fullName" ? (
                            <span className="inline-flex items-center gap-3">
                              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2f3744] text-[14px] text-white">
                                {bookingDetails.fullName
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </span>
                              {value}
                            </span>
                          ) : (
                            <span
                              className={
                                row.key === "street"
                                  ? "max-w-[440px]"
                                  : undefined
                              }
                            >
                              {value ?? "-"}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* participants */}
                  {bookingDetails.participants && (
                    <div className="mt-4">
                      <h4 className="text-[28px] text-[#9198a6]">
                        Participants
                      </h4>
                      <div className="mt-2 space-y-2">
                        {bookingDetails.participants.map((p, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-[22px]"
                          >
                            <div>{p.fullName}</div>
                            <div className="text-[#5f6572]">{p.email}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setSelectedBookingId(null)}
                className="h-[52px] min-w-[140px] rounded-2xl border border-[#ef2d73] px-8 text-[30px] font-medium text-[#ef2d73]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
