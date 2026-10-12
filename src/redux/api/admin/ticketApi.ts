import baseApi from "../baseApi";

const ticketApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTicket: builder.mutation({
      query: (data) => ({
        url: `/ticket/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ticket"],
    }),
    updateTicket: builder.mutation({
      query: (data) => ({
        url: `/ticket/update`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ticket"],
    }),

    getEventWiseTicketList: builder.query({
      query: (eventId) => ({
        url: `/ticket/event/${eventId}`,
        method: "GET",
      }),
      providesTags: ["ticket"],
    }),
  }),
});

export const {
  useCreateTicketMutation,
  useGetEventWiseTicketListQuery,
  useUpdateTicketMutation,
} = ticketApi;
