import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const getImagesUrl = createApi({
  reducerPath: 'getImagesUrl',
  baseQuery: fetchBaseQuery({ baseUrl: "http://192.168.0.184:3004/" }),
  endpoints: (builder) => ({
    addFeedback: builder.mutation({
      query: (body) => ({
        url: "feedBack/addFeedback",   // <-- no leading slash
        method: "POST",
        body,
      }),
    }),
    getImagesUrl: builder.mutation({
      query: (body) => ({
        url: "image",   // <-- no leading slash
        method: "POST",
        body,
      }),
    }),
    imageDelete: builder.mutation({
      query: (img) => ({
        url: `image?image=${encodeURIComponent(img)}`, // <-- no leading slash
        method: "DELETE",
      }),
    }),
  }),
})

export const { useGetImagesUrlMutation, useImageDeleteMutation,useAddFeedbackMutation } = getImagesUrl
