// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react'
import {dynamicBaseQuery } from "../badRequestHandler.js"
// Define a service using a base URL and expected endpoints
export const login = createApi({
  reducerPath: 'login',
  baseQuery: dynamicBaseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) =>({
        url: `/gym/login`,
        method: "POST",
        body
      }),
    }),
})
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation} = login