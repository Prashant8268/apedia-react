// redux/postSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "/get-posts",
    }),
    toggleLike: builder.mutation({
      query: ({ id }) => ({
        url: "/toggle-like",
        method: "POST",
        body: { id, type: "Post" },
      }),
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/delete-post/${id}`,
        method: "GET",
      }),
    }),
    addComment: builder.mutation({
      query: ({ postId, text, token }) => ({
        url: "/add-comment",
        method: "POST",
        body: { postId, text, token },
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetPostsQuery,
  useToggleLikeMutation,
  useDeletePostMutation,
  useAddCommentMutation,
} = postApi;
