


// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react'
import {dynamicBaseQuery } from "../badRequestHandler.js"
// Define a service using a base URL and expected endpoints
export const gymList = createApi({
  reducerPath: 'gymList',
  baseQuery: dynamicBaseQuery,
    tagTypes: ["gym"], // 👈 tags declare karne padte hain
  endpoints: (builder) => ({
    gymList: builder.query({
      query: (body) =>({
        url: `/gym/list`,
        method: "GET",
        body
      }),
    }),
    gymPendingList: builder.query({
      query: (body) =>({
        url: `/gym/pending`,
        method: "GET",
        body
      }),
        providesTags: ["gym"], // 👈 is query ka tag
    }),
    approvedGym: builder.mutation({
      query: (id) =>({
        url: `/gym/${id}/approve`,
        method: "PUT",
      }),
        invalidatesTags:["gym"]
    }),
    rejectedGym: builder.mutation({
      query: (id) =>({
        url: `/gym/${id}/reject`,
        method: "PUT",
      }),
        invalidatesTags:["gym"]
    }),
   suspendGym: builder.mutation({
  query: ({ id, status }) => ({
    url: `/gym/${id}/suspend`,
    method: "PUT",
    body: { status },   // 👈 send status in request body
  }),
        invalidatesTags:["gym"]
    }),
   gymDetail: builder.query({
  query: (id) => ({
    url: `/gym/gym-detail/${id}`,
    method: "GET",
  }),
        invalidatesTags:["gym"]
    }),
})
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGymDetailQuery,useGymListQuery,useGymPendingListQuery,useApprovedGymMutation,useRejectedGymMutation,useSuspendGymMutation} = gymList