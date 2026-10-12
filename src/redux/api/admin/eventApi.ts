/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import baseApi from "../baseApi";

const eventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEventSlots: builder.query({
      query: ({ page, limit }) => {
        const params: Record<string, any> = {};

        if (page) params.page = page;
        if (limit) params.limit = limit;

        return {
          url: `/slot/all-slots`,
          method: "GET",
          params,
        };
      },
      providesTags: ["event"],
    }),

    createEvent: builder.mutation({
      query: ( eventData ) => ({
        url: `/event/create`,
        method: "POST",
        body: eventData,
      }),
      invalidatesTags: ["event"],
    }),

    createEventSlot: builder.mutation({
      query: (slotData) => ({
        url: `/slot/create`,
        method: "POST",
        body: slotData,
      }),
      invalidatesTags: ["event"],
    }),

    updateEventSlot: builder.mutation({
      query: ({ id, slotData }) => ({
        url: `/slot/${id}`,
        method: "PATCH",
        body: slotData,
      }),
      invalidatesTags: ["event"],
    }),

    deleteEventSlot: builder.mutation({
      query: (id) => ({
        url: `/slot/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["event"],
    }),

    getAllEventBookingList: builder.query({
      query: ({ page, limit, search }) => {
        const params: Record<string, any> = {};

        if (page) params.page = page;
        if (limit) params.limit = limit;
        if (search) params.search = search;

        return {
          url: `/admin/booking-list`,
          method: "GET",
          params,
        };
      },
      providesTags: ["event"],
    }),

    getBookingDetails: builder.query({
      query: (id) => ({
        url: `/booking/ticket-details/${id}`,
        method: "GET",
      }),
      providesTags: ["event"],
    }),

    getEventDetails: builder.query({
      query: (id) => ({
        url: `/event/details/${id}`,
        method: "GET",
      }),
      providesTags: ["event"],
    }),

    getAllEventList: builder.query({
      query: ({ page, limit, search }) => {
        const params: Record<string, any> = {};

        if (page) params.page = page;
        if (limit) params.limit = limit;
        if (search) params.search = search;

        return {
          url: `/event/all`,
          method: "GET",
          params,
        };
      },
      providesTags: ["event"],
    }),

  }),
});

export const {
  useLazyGetAllEventSlotsQuery,
  useCreateEventMutation,
  useCreateEventSlotMutation,
  useUpdateEventSlotMutation,
  useDeleteEventSlotMutation,
  useLazyGetAllEventBookingListQuery,
  useGetBookingDetailsQuery,
  useGetEventDetailsQuery,
  useGetAllEventListQuery,
} = eventApi;
