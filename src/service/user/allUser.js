// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react'
import {dynamicBaseQuery } from "../badRequestHandler.js"
// Define a service using a base URL and expected endpoints
export const allUser = createApi({
  reducerPath: 'allUser',
  baseQuery: dynamicBaseQuery,
    tagTypes: ["User"], // 👈 tags declare karne padte hain
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: (body) =>({
        url: `/user/list`,
        method: "GET",
      }),
      providesTags: ["User"], // 👈 is query ka tag
    }),
    getUserDetail: builder.query({
      query: (id) =>({
        url: `/gym/users/${id}`,
        method: "GET",
      })
    }),
    changeFeesStatus: builder.mutation({
      query: (body) =>({
        url: `/user/${body?.id}/status`,
        method: "PUT",
        body:{status:body?.fee_status}
      }),
      invalidatesTags:["User"]
    }),
    deleteMember: builder.mutation({
      query: (memberId) =>({
        url: `/gym/delete-member/${memberId}`,
        method: "POST",
     
      }),
      invalidatesTags:["User"]
    }),
    getMemberAttendance: builder.query({
      query: ({membershipId,memberId}) =>({
        url: `/user/get-member-attendance/${membershipId}/${memberId}`,
  
      }),
    }),
   getUserPlanHistory: builder.query({
  query: ({ gymId, memberId }) => ({
    url: `/user/get-plan-history?gymId=${gymId}&memberId=${memberId}`,
    method: "GET",
  }),
}),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {useGetUserPlanHistoryQuery,useGetMemberAttendanceQuery,useDeleteMemberMutation, useGetAllUserQuery ,useGetUserDetailQuery,useChangeFeesStatusMutation} = allUser