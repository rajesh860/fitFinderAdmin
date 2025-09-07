// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react'
import {dynamicBaseQuery } from "../badRequestHandler.js"
// Define a service using a base URL and expected endpoints
export const userRegister = createApi({
  reducerPath: 'userRegister',
  baseQuery: dynamicBaseQuery,
  endpoints: (builder) => ({
    memberRegister: builder.mutation({
      query: (body) =>({
        url: `/user/register-by-admin`,
        method: "POST",
        body
      })
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useMemberRegisterMutation } = userRegister