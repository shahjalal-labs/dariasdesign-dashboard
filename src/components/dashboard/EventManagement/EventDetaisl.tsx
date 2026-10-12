"use client";

import {
  useCreateEventSlotMutation,
  useDeleteEventSlotMutation,
  useGetEventDetailsQuery,
  useUpdateEventSlotMutation,
} from "@/redux/api/admin/eventApi";
import {
  useCreateTicketMutation,
  useGetEventWiseTicketListQuery,
  useUpdateTicketMutation,
} from "@/redux/api/admin/ticketApi";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import TableSkeleton from "@/components/table/TableSkeleton";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Swal from "sweetalert2";

type EventSlot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  quantity: number;
};

type EventDetails = {
  id: string;
  eventName: string;
  bannerImage?: string;
  sliderImages?: string[];
  overlapImgs?: string[];
  content?: string;
  createdAt?: string;
  slots?: EventSlot[];
};

type EventModalMode = "create" | "edit";

type EventFormState = {
  date: string;
  startTime: string;
  endTime: string;
  quantity: string;
};

type Ticket = {
  id: string;
  ticketName: string;
  ticketPrice: number;
};

type TicketModalMode = "create" | "edit";

type TicketFormState = {
  ticketName: string;
  ticketPrice: string;
};

function EventDetaisl() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<EventModalMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingSlotId, setDeletingSlotId] = useState<string | null>(null);
  const [formState, setFormState] = useState<EventFormState>({
    date: new Date().toISOString().slice(0, 10),
    startTime: "16:00",
    endTime: "18:30",
    quantity: "10",
  });

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketMode, setTicketMode] = useState<TicketModalMode>("create");
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [isTicketSubmitting, setIsTicketSubmitting] = useState(false);
  const [ticketFormState, setTicketFormState] = useState<TicketFormState>({
    ticketName: "",
    ticketPrice: "",
  });

  const params = useParams();
  const eventId = params.id as string;

  const {
    data: eventDetailsResponse,
    isFetching,
    refetch,
  } = useGetEventDetailsQuery(eventId);
  const [createSlot] = useCreateEventSlotMutation();
  const [updateSlot] = useUpdateEventSlotMutation();
  const [deleteSlot] = useDeleteEventSlotMutation();

  const {
    data: ticketsResponse,
    isFetching: isTicketsFetching,
    refetch: refetchTickets,
  } = useGetEventWiseTicketListQuery(eventId);
  const [createTicket] = useCreateTicketMutation();
  const [updateTicket] = useUpdateTicketMutation();

  const eventDetails = eventDetailsResponse?.result as EventDetails | undefined;
  const slots = eventDetails?.slots || [];
  const sliderImages = eventDetails?.sliderImages || [];
  const overlapImages = eventDetails?.overlapImgs || [];

  const tickets: Ticket[] = ticketsResponse?.result || [];

  const formatDate = (value?: string) => {
    if (!value) return "-";

    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getEventSummary = () => {
    const content = eventDetails?.content?.trim();

    if (content) return content;

    return "This event includes multiple gallery assets and a managed slot schedule. Use the controls below to review and update the available slots for this event.";
  };

  const openCreateModal = () => {
    setMode("create");
    setEditingId(null);
    setFormState({
      date: new Date().toISOString().slice(0, 10),
      startTime: "16:00",
      endTime: "18:30",
      quantity: "10",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (slot: EventSlot) => {
    setMode("edit");
    setEditingId(slot.id);

    const dateOnly = new Date(slot.date).toISOString().slice(0, 10);
    const to24 = (ampm: string) => {
      const [time, period] = ampm.split(" ");
      const [hh, mm] = time.split(":");
      let hour = parseInt(hh, 10);
      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;
      return `${String(hour).padStart(2, "0")}:${mm}`;
    };

    setFormState({
      date: dateOnly,
      startTime: to24(slot.startTime),
      endTime: to24(slot.endTime),
      quantity: String(slot.quantity),
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
    }
  };

  const toAMPM = (time24: string) => {
    const [hh, mm] = time24.split(":");
    let hour = parseInt(hh, 10);
    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${String(hour).padStart(2, "0")}:${mm} ${period}`;
  };

  const submitModal = async () => {
    // Validate time range
    if (formState.startTime >= formState.endTime) {
      toast.error("End time must be after start time.");
      return;
    }

    const quantity = Number(formState.quantity) || 0;
    
    // Validate quantity
    if (quantity <= 0) {
      toast.error("Quantity must be greater than 0.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      eventId,
      date: new Date(formState.date).toISOString(),
      startTime: toAMPM(formState.startTime),
      endTime: toAMPM(formState.endTime),
      quantity,
    };

    try {
      if (mode === "create") {
        await createSlot(payload).unwrap();
        toast.success("Slot created successfully!");
      } else if (editingId) {
        await updateSlot({ id: editingId, slotData: payload }).unwrap();
        toast.success("Slot updated successfully!");
      }

      await refetch();
      closeModal();
    } catch (error: any) {
      // Handle API error response
      const errorMessage = error?.data?.message || 
                          error?.message || 
                          "Something went wrong. Please try again.";
      
      // Check for specific overlap error
      if (error?.data?.message?.includes("overlaps with an existing slot")) {
        toast.error("The selected slot time overlaps with an existing slot. Please choose a different time.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (slotId: string) => {
    // Show SweetAlert confirmation
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this action!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e7185d',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-2xl',
        title: 'text-2xl font-semibold',
        confirmButton: 'px-6 py-2.5 text-base font-medium',
        cancelButton: 'px-6 py-2.5 text-base font-medium',
      }
    });

    if (!result.isConfirmed) {
      return;
    }

    setDeletingSlotId(slotId);

    try {
      await deleteSlot(slotId).unwrap();
      await refetch();
      // toast.success("Slot deleted successfully!");
      
      // Optional: Show success SweetAlert
      await Swal.fire({
        title: 'Deleted!',
        text: 'The slot has been deleted successfully.',
        icon: 'success',
        confirmButtonColor: '#e7185d',
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true,
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'px-6 py-2.5 text-base font-medium',
        }
      });
    } catch (error: any) {
      const errorMessage = error?.data?.message || 
                          error?.message || 
                          "Failed to delete slot. Please try again.";
      toast.error(errorMessage);
      
      // Show error SweetAlert
      await Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#e7185d',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'px-6 py-2.5 text-base font-medium',
        }
      });
    } finally {
      setDeletingSlotId(null);
    }
  };

  const openCreateTicketModal = () => {
    setTicketMode("create");
    setEditingTicketId(null);
    setTicketFormState({
      ticketName: "",
      ticketPrice: "",
    });
    setIsTicketModalOpen(true);
  };

  const openEditTicketModal = (ticket: Ticket) => {
    setTicketMode("edit");
    setEditingTicketId(ticket.id);
    setTicketFormState({
      ticketName: ticket.ticketName,
      ticketPrice: String(ticket.ticketPrice),
    });
    setIsTicketModalOpen(true);
  };

  const closeTicketModal = () => {
    if (!isTicketSubmitting) {
      setIsTicketModalOpen(false);
    }
  };

  const submitTicketModal = async () => {
    if (!ticketFormState.ticketName.trim()) {
      toast.error("Ticket name is required.");
      return;
    }
    const price = Number(ticketFormState.ticketPrice);
    if (isNaN(price) || price <= 0) {
      toast.error("Ticket price must be a valid positive number.");
      return;
    }

    setIsTicketSubmitting(true);

    try {
      if (ticketMode === "create") {
        const payload = {
          eventId,
          ticketName: ticketFormState.ticketName.trim(),
          ticketPrice: price,
        };
        await createTicket(payload).unwrap();
        toast.success("Ticket created successfully!");
      } else if (editingTicketId) {
        const payload = {
          ticketId: editingTicketId,
          ticketName: ticketFormState.ticketName.trim(),
          ticketPrice: price,
        };
        await updateTicket(payload).unwrap();
        toast.success("Ticket updated successfully!");
      }

      await refetchTickets();
      closeTicketModal();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsTicketSubmitting(false);
    }
  };

  return (
    <>
      <section className="overflow-hidden rounded-3xl border border-[#ececf2] bg-[#f7f7fb] shadow-sm">
        <div className="border-b border-white/70 bg-gradient-to-br from-[#fff7fa] via-[#ffffff] to-[#f3f7ff] px-4 py-5 md:px-6 md:py-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <Link
                href="/admin/event-management"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#6b7280] hover:text-[#111827]"
              >
                <ArrowLeft size={16} />
                Back to events
              </Link>

              <h1 className="text-[34px] font-semibold leading-none text-[#25252a] md:text-[42px]">
                {eventDetails?.eventName || "Event Details"}
              </h1>
            </div>

            <button
              onClick={openCreateModal}
              className="h-12 rounded-xl bg-[#e7185d] px-7 text-base font-medium text-white transition-opacity hover:opacity-90"
            >
              + Create Event Slot
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
              <div className="text-sm font-medium text-[#6b7280]">Created</div>
              <div className="mt-2 text-lg font-semibold text-[#111827]">
                {formatDate(eventDetails?.createdAt)}
              </div>
            </div>
            <div className="rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
              <div className="text-sm font-medium text-[#6b7280]">Slots</div>
              <div className="mt-2 text-lg font-semibold text-[#111827]">
                {slots.length}
              </div>
            </div>
            <div className="rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
              <div className="text-sm font-medium text-[#6b7280]">Images</div>
              <div className="mt-2 text-lg font-semibold text-[#111827]">
                {1 + sliderImages.length + overlapImages.length}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 px-4 py-5 md:px-6 md:py-6">
          <div className="grid gap-6 lg:grid-cols-[1.45fr_0.55fr]">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-[32px] bg-[#101827] shadow-lg ring-1 ring-black/5">
                {eventDetails?.bannerImage ? (
                  <div className="relative min-h-[380px] md:min-h-[520px]">
                    <Image
                      src={eventDetails.bannerImage}
                      alt={eventDetails.eventName}
                      className="h-full w-full object-cover"
                      width={1920}
                      height={1080}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  </div>
                ) : (
                  <div className="flex min-h-[380px] items-center justify-center bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] text-[#6b7280] md:min-h-[520px]">
                    No banner image available
                  </div>
                )}
              </div>

              <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-4xl">
                    <span className="inline-flex rounded-full bg-[#fff1f5] px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#e7185d]">
                      Event Content
                    </span>
                  </div>
                  <div className="rounded-2xl bg-[#f8fafc] px-4 py-3 text-sm text-[#6b7280] ring-1 ring-black/5">
                    Updated {formatDate(eventDetails?.createdAt)}
                  </div>
                </div>

                <div
                  className="mt-6 max-w-5xl text-[17px] leading-8 text-[#374151] md:text-[19px]"
                  dangerouslySetInnerHTML={{
                    __html: getEventSummary(),
                  }}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[32px] bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-6">
                <h2 className="text-xl font-semibold text-[#1f2937]">Slider Images</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {sliderImages.length > 0 ? (
                    sliderImages.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="group overflow-hidden rounded-2xl bg-[#f3f4f6] shadow-sm"
                      >
                        <img
                          src={image}
                          alt={`${eventDetails?.eventName || "Event"} slider ${index + 1}`}
                          className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[#d1d5db] px-4 py-10 text-center text-sm text-[#6b7280]">
                      No slider images uploaded
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[32px] bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-[#1f2937]">Overlap Images</h2>
                  <span className="text-sm text-[#6b7280]">{overlapImages.length} files</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                  {overlapImages.length > 0 ? (
                    overlapImages.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="group overflow-hidden rounded-2xl bg-[#f3f4f6] shadow-sm ring-1 ring-black/5"
                      >
                        <img
                          src={image}
                          alt={`${eventDetails?.eventName || "Event"} overlap ${index + 1}`}
                          className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 rounded-2xl border border-dashed border-[#d1d5db] px-4 py-10 text-center text-sm text-[#6b7280] sm:col-span-3 lg:col-span-2 xl:col-span-3">
                      No overlap images uploaded
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 mt-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#1f2937]">Event Slots</h2>
          </div>
          <div className="overflow-x-auto">
            {isFetching ? (
              <TableSkeleton columns={4} rows={4} className="min-w-[900px]" />
            ) : (
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-[#e8eaf0] text-left text-base font-medium text-[#545861]">
                    <th className="py-4 pr-4">Date</th>
                    <th className="px-4 py-4">Time</th>
                    <th className="px-4 py-4">Maximum Quantity</th>
                    <th className="px-4 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map((slot) => (
                    <tr key={slot.id} className="text-base text-[#2f3138]">
                      <td className="py-5 pr-4">{new Date(slot.date).toLocaleDateString()}</td>
                      <td className="px-4 py-5 text-[#4c5360]">{`${slot.startTime} - ${slot.endTime}`}</td>
                      <td className="px-4 py-5 text-[#4c5360]">{slot.quantity}</td>
                      <td className="px-4 py-5">
                        <div className="flex justify-end gap-3">
                          <button
                            aria-label="Edit slot"
                            onClick={() => openEditModal(slot)}
                            className="text-[#727888] transition-opacity hover:opacity-80"
                            disabled={!!deletingSlotId}
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            aria-label="Delete slot"
                            onClick={() => handleDelete(slot.id)}
                            className="text-[#ff5f63] transition-opacity hover:opacity-80 disabled:opacity-50"
                            disabled={deletingSlotId === slot.id}
                          >
                            {deletingSlotId === slot.id ? (
                              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#ff5f63] border-t-transparent" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {slots.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-[#6b7280]">
                        No slots found for this event.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            )}
          </div>

          <div className="mb-4 mt-12 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#1f2937]">Tickets</h2>
            <button
              onClick={openCreateTicketModal}
              className="h-10 rounded-xl bg-[#e7185d] px-5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              + Create Ticket
            </button>
          </div>
          <div className="overflow-x-auto">
            {isTicketsFetching ? (
              <TableSkeleton columns={3} rows={3} className="min-w-[600px]" />
            ) : (
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#e8eaf0] text-left text-base font-medium text-[#545861]">
                    <th className="py-4 pr-4">Ticket Name</th>
                    <th className="px-4 py-4">Price</th>
                    <th className="px-4 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="text-base text-[#2f3138]">
                      <td className="py-5 pr-4">{ticket.ticketName}</td>
                      <td className="px-4 py-5 text-[#4c5360]">${ticket.ticketPrice}</td>
                      <td className="px-4 py-5">
                        <div className="flex justify-end gap-3">
                          <button
                            aria-label="Edit ticket"
                            onClick={() => openEditTicketModal(ticket)}
                            className="text-[#727888] transition-opacity hover:opacity-80"
                          >
                            <Pencil size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {tickets.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-10 text-center text-[#6b7280]">
                        No tickets found for this event.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget && !isSubmitting) {
              closeModal();
            }
          }}
        >
          <div className="absolute inset-0 bg-[#161a23]/40" />

          <div className="relative z-10 w-full max-w-[760px] rounded-[24px] bg-white px-6 pb-8 pt-6 shadow-2xl md:px-10 md:pb-10 md:pt-8">
            <h3 className="font-serif text-[30px] leading-none text-[#1f1f24] md:text-[48px]">
              {mode === "create" ? "Create New Event Slot" : "Edit Event Slot"}
            </h3>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
              <label className="space-y-2">
                <span className="text-base md:text-xl font-medium text-[#22252d]">Date</span>
                <div>
                  <input
                    type="date"
                    value={formState.date}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        date: event.target.value,
                      }))
                    }
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-2xl border border-[#d8dde6] px-4 text-[16px] text-[#929aaa] outline-none focus:border-[#c8ced9] disabled:opacity-50"
                  />
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-base md:text-xl font-medium text-[#22252d]">Time</span>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="time"
                    value={formState.startTime}
                    onChange={(e) =>
                      setFormState((p) => ({ ...p, startTime: e.target.value }))
                    }
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-2xl border border-[#d8dde6] px-4 text-[16px] text-[#929aaa] outline-none focus:border-[#c8ced9] disabled:opacity-50"
                  />
                  <input
                    type="time"
                    value={formState.endTime}
                    onChange={(e) =>
                      setFormState((p) => ({ ...p, endTime: e.target.value }))
                    }
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-2xl border border-[#d8dde6] px-4 text-[16px] text-[#929aaa] outline-none focus:border-[#c8ced9] disabled:opacity-50"
                  />
                </div>
              </label>
            </div>

            <label className="mt-6 block space-y-2">
              <span className="text-base md:text-xl font-medium text-[#22252d]">Maximum quantity</span>
              <input
                type="number"
                min={0}
                value={formState.quantity}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    quantity: event.target.value,
                  }))
                }
                disabled={isSubmitting}
                className="h-14 w-full rounded-2xl border border-[#d8dde6] px-4 text-[20px] text-[#929aaa] outline-none focus:border-[#c8ced9] disabled:opacity-50"
              />
            </label>

            <div className="mt-8 flex items-center justify-end gap-4">
              <button
                onClick={closeModal}
                disabled={isSubmitting}
                className="h-[62px] min-w-[180px] rounded-2xl border border-[#ef2d73] px-8 text-base md:text-xl font-medium text-[#ef2d73] transition-opacity hover:opacity-80 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={submitModal}
                disabled={isSubmitting}
                className="relative h-[62px] min-w-[180px] rounded-2xl bg-[#e7185d] px-8 text-base md:text-xl font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <span className="opacity-0">{mode === "create" ? "Submit" : "Save Changes"}</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </div>
                  </>
                ) : (
                  mode === "create" ? "Submit" : "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isTicketModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget && !isTicketSubmitting) {
              closeTicketModal();
            }
          }}
        >
          <div className="absolute inset-0 bg-[#161a23]/40" />

          <div className="relative z-10 w-full max-w-[500px] rounded-[24px] bg-white px-6 pb-8 pt-6 shadow-2xl md:px-10 md:pb-10 md:pt-8">
            <h3 className="font-serif text-[30px] leading-none text-[#1f1f24] md:text-[36px]">
              {ticketMode === "create" ? "Create Ticket" : "Edit Ticket"}
            </h3>

            <div className="mt-8 space-y-6">
              <label className="block space-y-2">
                <span className="text-base md:text-xl font-medium text-[#22252d]">Ticket Name</span>
                <input
                  type="text"
                  placeholder="e.g. Early Bird"
                  value={ticketFormState.ticketName}
                  onChange={(event) =>
                    setTicketFormState((prev) => ({
                      ...prev,
                      ticketName: event.target.value,
                    }))
                  }
                  disabled={isTicketSubmitting}
                  className="h-14 w-full rounded-2xl border border-[#d8dde6] px-4 text-[18px] text-[#22252d] outline-none focus:border-[#c8ced9] disabled:opacity-50"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-base md:text-xl font-medium text-[#22252d]">Ticket Price</span>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-[#929aaa]">
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    placeholder="e.g. 150"
                    value={ticketFormState.ticketPrice}
                    onChange={(event) =>
                      setTicketFormState((prev) => ({
                        ...prev,
                        ticketPrice: event.target.value,
                      }))
                    }
                    disabled={isTicketSubmitting}
                    className="h-14 w-full rounded-2xl border border-[#d8dde6] pl-8 pr-4 text-[18px] text-[#22252d] outline-none focus:border-[#c8ced9] disabled:opacity-50"
                  />
                </div>
              </label>
            </div>

            <div className="mt-8 flex items-center justify-end gap-4">
              <button
                onClick={closeTicketModal}
                disabled={isTicketSubmitting}
                className="h-[56px] min-w-[140px] rounded-2xl border border-[#ef2d73] px-6 text-base md:text-lg font-medium text-[#ef2d73] transition-opacity hover:opacity-80 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={submitTicketModal}
                disabled={isTicketSubmitting}
                className="relative h-[56px] min-w-[140px] rounded-2xl bg-[#e7185d] px-6 text-base md:text-lg font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-70"
              >
                {isTicketSubmitting ? (
                  <>
                    <span className="opacity-0">{ticketMode === "create" ? "Submit" : "Save Changes"}</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </div>
                  </>
                ) : (
                  ticketMode === "create" ? "Submit" : "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EventDetaisl;