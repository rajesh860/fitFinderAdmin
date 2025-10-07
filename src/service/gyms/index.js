// Need to use the React-specific entry point to import createApi
import { createApi } from "@reduxjs/toolkit/query/react";
import { dynamicBaseQuery } from "../badRequestHandler.js";
// Define a service using a base URL and expected endpoints
export const gymList = createApi({
  reducerPath: "gymList",
  baseQuery: dynamicBaseQuery,
  tagTypes: ["gym", "collection"], // 👈 tags declare karne padte hain
  endpoints: (builder) => ({
    gymList: builder.query({
      query: (body) => ({
        url: `/admin/gym-list`,
        method: "GET",
        body,
      }),
    }),
    gymPendingList: builder.query({
      query: (body) => ({
        url: `/admin/gym-pending`,
        method: "GET",
        body,
      }),
      providesTags: ["gym"], // 👈 is query ka tag
    }),
    approvedGym: builder.mutation({
      query: (id) => ({
        url: `/admin/${id}/approve`,
        method: "PUT",
      }),
      invalidatesTags: ["gym"],
    }),
    rejectedGym: builder.mutation({
      query: (id) => ({
        url: `/admin/${id}/reject`,
        method: "PUT",
      }),
      invalidatesTags: ["gym"],
    }),
    suspendGym: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/${id}/suspend`,
        method: "PUT",
        body: { status }, // 👈 send status in request body
      }),
      invalidatesTags: ["gym"],
    }),
    gymDetail: builder.query({
      query: (id) => ({
        url: `/admin/gym-detail/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["gym"],
    }),
    gymProfile: builder.query({
      query: () => ({
        url: `/gym/profile`,
        method: "GET",
      }),
      providesTags: ["gym"],
    }),
    updarteGymProfile: builder.mutation({
      query: ({ id, data }) => ({
        url: `/gym/update-gym-profile/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["gym"],
    }),
    getQuery: builder.query({
      query: (status) => ({
        url: `/gym/get-enquiry/${status}`,
        method: "POST",
      }),
      providesTags: ["gym"],
    }),
    cancelEnquiry: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/gym/cancel/enquiry/${id}`,
        method: "PUT",
        body: { reason: reason },
      }),
      invalidatesTags: ["gym"],
    }),
    approveEnquiry: builder.mutation({
      query: (id) => ({
        url: `/gym/enquiry/approve/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["gym"],
    }),
    completeEnquiry: builder.mutation({
      query: ({ id, uniqueNumber }) => ({
        url: `/gym/enquiry/complete/${id}`,
        method: "PUT",
        body: { uniqueNumber: uniqueNumber },
      }),
      invalidatesTags: ["gym"],
    }),
    addProgress: builder.mutation({
      query: (body) => ({
        url: `/gym/add-progress/${body?.memberId}`,
        method: "POST",
        body: body?.data,
      }),
    }),
    getProgress: builder.query({
      query: (id) => ({
        url: `/gym/get-progress/${id}`,
        method: "GET",
      }),
    }),
    getBookingEnquiry: builder.query({
      query: (id) => ({
        url: `/gym/booking-requests`,
        method: "GET",
      }),
    }),
    bookingApprove: builder.mutation({
      query: ({ planId, id }) => ({
        url: `/gym/booking-approve/${id}`,
        method: "POST",
        body: planId,
      }),
    }),
    generateQrCode: builder.mutation({
      query: () => ({
        url: `/gym/generate/qr`,
        method: "POST",
      }),
    }),
    editProgress: builder.mutation({
      query: ({ memberId, body }) => ({
        url: `/gym/edit-progress/${memberId}`,
        method: "POST",
        body: body,
      }),
    }),
    getFeesCollection: builder.query({
      query: () => ({
        url: `/gym/get-fees-collection`,
        method: "GET",
      }),
      providesTags: ["collection"], // 👈 is query ka tag
    }),
    addPendingPayment: builder.mutation({
      query: (body) => ({
        url: `/gym/add-pending-payment`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["collection"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useAddPendingPaymentMutation,
  useGetFeesCollectionQuery,
  useEditProgressMutation,
  useGenerateQrCodeMutation,
  useBookingApproveMutation,
  useGetBookingEnquiryQuery,
  useGetProgressQuery,
  useAddProgressMutation,
  useCompleteEnquiryMutation,
  useApproveEnquiryMutation,
  useCancelEnquiryMutation,
  useGetQueryQuery,
  useUpdarteGymProfileMutation,
  useGymDetailQuery,
  useGymListQuery,
  useGymPendingListQuery,
  useApprovedGymMutation,
  useGymProfileQuery,
  useRejectedGymMutation,
  useSuspendGymMutation,
} = gymList;
