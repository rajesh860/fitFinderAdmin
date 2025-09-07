


// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react'
import {dynamicBaseQuery } from "../badRequestHandler.js"
// Define a service using a base URL and expected endpoints
export const plans = createApi({
  reducerPath: 'plans',
  baseQuery: dynamicBaseQuery,
  endpoints: (builder) => ({
    gymPlans: builder.query({
      query: (body) =>({
        url: `/gym/getPlan`,
        method: "GET",
        body
      }),
    }),
    gymCreatePlans: builder.mutation({
      query: (body) =>({
        url: `/gym/create-plans`,
        method: "POST",
        body
      }),
    }),
    getMyPlan: builder.query({
      query: (body) =>({
        url: `/gym/getMyPlan`,
        method: "GET",
      }),
    }),
})
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGymPlansQuery,useGymCreatePlansMutation,useGetMyPlanQuery} = plans