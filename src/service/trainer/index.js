

// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react'
import {dynamicBaseQuery } from "../badRequestHandler.js"
// Define a service using a base URL and expected endpoints
export const trainer = createApi({
  reducerPath: 'trainer',
  baseQuery: dynamicBaseQuery,
  endpoints: (builder) => ({
    gymTrainerList: builder.query({
      query: (body) =>({
        url: `/gym/get-trainer-list`,
        method: "GET",
        body
      })
    }),
    getTrainerDetail: builder.query({
      query: (id) =>({
        url: `/trainer/detail/${id}`,
        method: "GET",
      })
    }),
   
  }),

})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetTrainerDetailQuery,useGymTrainerListQuery } = trainer