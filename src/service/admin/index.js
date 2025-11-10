


// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react'
import {dynamicBaseQuery } from "../badRequestHandler.js"
// Define a service using a base URL and expected endpoints
export const adminDashboard = createApi({
  reducerPath: 'adminDashboard',
  baseQuery: dynamicBaseQuery,
  endpoints: (builder) => ({
    adminDashboard: builder.query({
      query: (body) =>({
        url: `/admin/dashboard`,
        method: "GET",
        body
      }),
    }),
    gymRegister: builder.mutation({
      query: (body) =>({
        url: `/admin/gym-register`,
        method: "POST",
        body
      }),
    }),
})
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useAdminDashboardQuery,useGymRegisterMutation} = adminDashboard