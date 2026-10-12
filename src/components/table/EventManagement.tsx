"use client";

import {
  useCreateEventMutation,
  useGetAllEventListQuery,
} from "@/redux/api/admin/eventApi";
import { Eye, X, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardPagination from "./DashboardPagination";
import TableSkeleton from "./TableSkeleton";
import { Editor } from "@tinymce/tinymce-react";

type EventItem = {
  id: string;
  eventName: string;
  content: string;
  _count?: {
    slots?: number;
  };
};

type EventCreateFormState = {
  eventName: string;
  content: string;
  bannerImage: File | null;
  sliderImages: File[];
  overlapImages: File[];
};

const initialFormState: EventCreateFormState = {
  eventName: "",
  content: "",
  bannerImage: null,
  sliderImages: [],
  overlapImages: [],
};

const rowsPerPage = 10;

export default function EventManagement() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] =
    useState<EventCreateFormState>(initialFormState);
  const [formError, setFormError] = useState("");
  const { data: eventsResponse, isFetching } = useGetAllEventListQuery({
    page,
    limit: rowsPerPage,
  });

  const [createEventFn, { isLoading: isCreating }] = useCreateEventMutation();

  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [sliderPreviews, setSliderPreviews] = useState<string[]>([]);
  const [overlapPreviews, setOverlapPreviews] = useState<string[]>([]);

  const events: EventItem[] =
    (eventsResponse?.result?.events as EventItem[]) || [];
  const totalPages = Math.max(
    1,
    eventsResponse?.result?.meta?.totalPages ??
      eventsResponse?.result?.meta?.totalPage ??
      1,
  );

  // Helper function to truncate HTML content to 50-60 words
  const truncateContent = (htmlContent: string, maxWords: number = 55): string => {
    if (!htmlContent) return "";
    
    // Create a temporary div to extract text from HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    
    // Split into words
    const words = textContent.trim().split(/\s+/);
    
    // Check if we need to truncate
    if (words.length <= maxWords) {
      return htmlContent;
    }
    
    // Truncate to maxWords
    const truncatedWords = words.slice(0, maxWords);
    const truncatedText = truncatedWords.join(" ") + "...";
    
    return truncatedText;
  };

  useEffect(() => {
    if (!formState.bannerImage) {
      setBannerPreview(null);
      return;
    }

    const url = URL.createObjectURL(formState.bannerImage);
    setBannerPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [formState.bannerImage]);

  useEffect(() => {
    const urls = formState.sliderImages.map((file) =>
      URL.createObjectURL(file),
    );
    setSliderPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [formState.sliderImages]);

  useEffect(() => {
    const urls = formState.overlapImages.map((file) =>
      URL.createObjectURL(file),
    );
    setOverlapPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [formState.overlapImages]);

  const handleEditorChange = (content: string) => {
    setFormState((prev) => ({ ...prev, content }));
  };

  const removeBannerImage = () => {
    setFormState((prev) => ({ ...prev, bannerImage: null }));
  };

  const removeSliderImage = (indexToRemove: number) => {
    setFormState((prev) => ({
      ...prev,
      sliderImages: prev.sliderImages.filter(
        (_, index) => index !== indexToRemove,
      ),
    }));
  };

  const removeOverlapImage = (indexToRemove: number) => {
    setFormState((prev) => ({
      ...prev,
      overlapImages: prev.overlapImages.filter(
        (_, index) => index !== indexToRemove,
      ),
    }));
  };

  const openCreateModal = () => {
    setFormError("");
    setFormState(initialFormState);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isCreating) return;

    setIsModalOpen(false);
    setFormError("");
    setFormState(initialFormState);
  };

  const handleCreateEvent = async () => {
    if (!formState.eventName.trim()) {
      setFormError("Event name is required.");
      return;
    }

    if (!formState.content.trim()) {
      setFormError("Event content is required.");
      return;
    }

    const payload = new FormData();
    payload.append(
      "bodyData",
      JSON.stringify({
        eventName: formState.eventName.trim(),
        content: formState.content.trim(),
      }),
    );

    if (formState.bannerImage) {
      payload.append("bannerImage", formState.bannerImage);
    }

    // Append slider images - matching backend expected field name
    formState.sliderImages.forEach((file) => {
      payload.append("sliderImages", file);
    });

    // Append overlap images - matching backend expected field name (overlapImages, not overlapImgs)
    formState.overlapImages.forEach((file) => {
      payload.append("overlapImgs", file);
    });

    try {
      await createEventFn(payload).unwrap();
      setPage(1);
      closeModal();
    } catch (error: any) {
      console.error("Create event error:", error);
      setFormError(
        "Unable to create the event. Please check the uploaded data and try again.",
      );
    }
  };

  return (
    <>
      <section className="rounded-3xl border border-[#ececf2] bg-white px-4 py-5 shadow-sm md:px-6 md:py-6">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#e7185d]">
              Events
            </p>
            <h1 className="mt-2 text-[34px] font-semibold leading-none text-[#25252a]">
              Event Management
            </h1>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#e7185d] to-[#ff5d8f] px-6 text-base font-semibold text-white shadow-lg shadow-[#e7185d]/20 transition-transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#e7185d]/25"
          >
            + Create New Event
          </button>
        </div>

        <div className="overflow-x-auto">
          {isFetching && events.length === 0 ? (
            <TableSkeleton columns={4} rows={5} className="min-w-[900px]" />
          ) : (
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-[#e8eaf0] text-left text-base font-medium text-[#545861]">
                  <th className="py-4 pr-4">Event Name</th>
                  <th className="px-4 py-4">Content</th>
                  <th className="px-4 py-4">Desire Slot</th>
                  <th className="px-4 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="text-base text-[#2f3138]">
                    <td className="py-5 pr-4">{event.eventName}</td>
                    <td className="px-4 py-5 text-[#4c5360] max-w-[500px]">
                      <div 
                        className="line-clamp-3 overflow-hidden"
                        dangerouslySetInnerHTML={{ 
                          __html: truncateContent(event.content, 55)
                        }}
                      />
                    </td>
                    <td className="px-4 py-5 text-[#4c5360]">
                      {event._count?.slots ?? 0}
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/admin/event-management/details/${event.id}`}
                          aria-label="View event details"
                          className="text-[#727888] transition-opacity hover:opacity-80"
                        >
                          <Eye size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
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

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="absolute inset-0 bg-[#0f172a]/55 backdrop-blur-sm" />

          <div className="relative z-10 flex max-h-[90vh] w-full max-w-[1020px] flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="border-b border-[#eef0f4] bg-gradient-to-r from-[#fff5f8] to-[#f8fbff] px-6 py-5 md:px-8 md:py-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#e7185d]">
                    Create Event
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#101828] md:text-4xl">
                    Build a new event with images and description
                  </h2>
                </div>

                <button
                  onClick={closeModal}
                  className="rounded-full border border-[#e4e7ec] px-4 py-2 text-sm font-medium text-[#344054] transition-colors hover:bg-[#f9fafb]"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#fafbfc] p-6 md:p-8 space-y-6">
              {/* Event Details Card */}
              <div className="space-y-6 rounded-[28px] border border-[#eef0f4] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#101828]">
                  Event Details
                </h3>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-[#344054]">
                    Event Name
                  </span>
                  <input
                    type="text"
                    value={formState.eventName}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        eventName: event.target.value,
                      }))
                    }
                    placeholder="Enter event name"
                    className="h-14 w-full rounded-2xl border border-[#d0d5dd] bg-white px-4 py-3 text-[15px] text-[#101828] outline-none transition focus:border-[#e7185d] focus:ring-4 focus:ring-[#e7185d]/10"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-[#344054]">
                    Event Description
                  </span>
                  <Editor
                    apiKey="4kjrncewwa4057zz04om0mle4q3to49bypq57bh6qgq5f0n3"
                    value={formState.content}
                    init={{
                      height: 250,
                      menubar: false,
                      plugins: [
                        "anchor",
                        "autolink",
                        "charmap",
                        "codesample",
                        "emoticons",
                        "image",
                        "link",
                        "lists",
                        "media",
                        "searchreplace",
                        "table",
                        "visualblocks",
                        "wordcount",
                      ],
                      toolbar:
                        "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | emoticons charmap | removeformat",
                      toolbar_mode: "wrap",
                      content_style:
                        "body { font-family:Arial, Helvetica, sans-serif; font-size:14px }",
                    }}
                    onEditorChange={handleEditorChange}
                  />
                </label>
              </div>

              {/* Banner Image Card */}
              <div className="rounded-[28px] border border-[#eef0f4] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-[#101828]">
                      Banner Image
                    </h3>
                    <p className="text-sm text-[#667085]">
                      Recommended: wide hero image
                    </p>
                  </div>
                </div>

                <label className="mt-4 block cursor-pointer rounded-2xl border-2 border-dashed border-[#d0d5dd] bg-[#f9fafb] p-6 transition hover:border-[#e7185d] hover:bg-[#fff7fa] group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        bannerImage: event.target.files?.[0] ?? null,
                      }))
                    }
                    className="hidden"
                  />

                  <div className="flex flex-col items-center justify-center space-y-2">
                    <UploadCloud className="h-8 w-8 text-[#667085] transition-colors group-hover:text-[#e7185d]" />
                    <div className="text-center text-sm font-medium text-[#344054]">
                      Click to upload banner image
                    </div>
                    <div className="text-center text-xs text-[#667085]">
                      PNG, JPG, WEBP supported
                    </div>
                  </div>
                </label>

                {bannerPreview && (
                  <div className="relative mt-4 overflow-hidden rounded-2xl border border-[#eef0f4]">
                    <img
                      src={bannerPreview}
                      alt="Banner preview"
                      className="h-56 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeBannerImage}
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#0f172a]/70 text-white backdrop-blur-sm transition-all hover:bg-red-600 hover:scale-105 shadow-md"
                      aria-label="Remove banner image"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* Slider Images Card */}
              <div className="rounded-[28px] border border-[#eef0f4] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-[#101828]">
                      Slider Images
                    </h3>
                    <p className="text-sm text-[#667085]">
                      Upload multiple images for the slider
                    </p>
                  </div>
                  <span className="rounded-full bg-[#fff5f8] px-3 py-1 text-xs font-semibold text-[#e7185d] ring-1 ring-[#f2c4d3]">
                    {formState.sliderImages.length} selected
                  </span>
                </div>

                <label className="mt-4 block cursor-pointer rounded-2xl border-2 border-dashed border-[#d0d5dd] bg-[#f9fafb] p-6 transition hover:border-[#e7185d] hover:bg-[#fff7fa] group">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => {
                      const newFiles = Array.from(event.target.files || []);
                      setFormState((prev) => ({
                        ...prev,
                        sliderImages: [...prev.sliderImages, ...newFiles],
                      }));
                    }}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <UploadCloud className="h-8 w-8 text-[#667085] transition-colors group-hover:text-[#e7185d]" />
                    <div className="text-center text-sm font-medium text-[#344054]">
                      Click to upload slider images
                    </div>
                    <div className="text-center text-xs text-[#667085]">
                      Multiple files allowed
                    </div>
                  </div>
                </label>

                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {sliderPreviews.length > 0 ? (
                    sliderPreviews.map((preview, index) => (
                      <div
                        key={`${preview}-${index}`}
                        className="relative group overflow-hidden rounded-2xl border border-[#eef0f4]"
                      >
                        <img
                          src={preview}
                          alt={`Slider preview ${index + 1}`}
                          className="h-28 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={() => removeSliderImage(index)}
                          className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#0f172a]/70 text-white backdrop-blur-sm transition-all hover:bg-red-600 hover:scale-105 shadow-md"
                          aria-label="Remove slider image"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full rounded-2xl border border-dashed border-[#d0d5dd] bg-[#f9fafb]/50 px-4 py-8 text-center text-sm text-[#667085]">
                      No slider images selected yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Overlap Images Card */}
              <div className="rounded-[28px] border border-[#eef0f4] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-[#101828]">
                      Overlap Images
                    </h3>
                    <p className="text-sm text-[#667085]">
                      Add the extra overlay visuals here
                    </p>
                  </div>
                  <span className="rounded-full bg-[#fff5f8] px-3 py-1 text-xs font-semibold text-[#e7185d] ring-1 ring-[#f2c4d3]">
                    {formState.overlapImages.length} selected
                  </span>
                </div>

                <label className="mt-4 block cursor-pointer rounded-2xl border-2 border-dashed border-[#d0d5dd] bg-[#f9fafb] p-6 transition hover:border-[#e7185d] hover:bg-[#fff7fa] group">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => {
                      const newFiles = Array.from(event.target.files || []);
                      setFormState((prev) => ({
                        ...prev,
                        overlapImages: [...prev.overlapImages, ...newFiles],
                      }));
                    }}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <UploadCloud className="h-8 w-8 text-[#667085] transition-colors group-hover:text-[#e7185d]" />
                    <div className="text-center text-sm font-medium text-[#344054]">
                      Click to upload overlap images
                    </div>
                    <div className="text-center text-xs text-[#667085]">
                      Multiple files allowed
                    </div>
                  </div>
                </label>

                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {overlapPreviews.length > 0 ? (
                    overlapPreviews.map((preview, index) => (
                      <div
                        key={`${preview}-${index}`}
                        className="relative group overflow-hidden rounded-2xl border border-[#eef0f4]"
                      >
                        <img
                          src={preview}
                          alt={`Overlap preview ${index + 1}`}
                          className="h-28 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={() => removeOverlapImage(index)}
                          className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#0f172a]/70 text-white backdrop-blur-sm transition-all hover:bg-red-600 hover:scale-105 shadow-md"
                          aria-label="Remove overlap image"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full rounded-2xl border border-dashed border-[#d0d5dd] bg-[#f9fafb]/50 px-4 py-8 text-center text-sm text-[#667085]">
                      No overlap images selected yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-[#eef0f4] bg-white px-6 py-4 md:px-8">
              {formError ? (
                <p className="mb-4 rounded-2xl bg-[#fff1f3] px-4 py-3 text-sm font-medium text-[#c01048]">
                  {formError}
                </p>
              ) : null}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                <button
                  onClick={closeModal}
                  disabled={isCreating}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-[#d0d5dd] bg-white px-6 text-sm font-semibold text-[#344054] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEvent}
                  disabled={isCreating}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#e7185d] to-[#ff5d8f] px-6 text-sm font-semibold text-white shadow-lg shadow-[#e7185d]/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isCreating ? "Creating Event..." : "Create Event"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}