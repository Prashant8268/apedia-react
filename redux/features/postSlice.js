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
    addPost: builder.mutation({
      query: (formData) => ({
        url: "/newPost",
        method: "POST",
        body: formData,
      }),
      async onQueryStarted(formData, { dispatch, queryFulfilled }) {
        // Optimistically update cache (optional)

        try {
          // Await the actual response
          const { data } = await queryFulfilled;
          const newPost = data.newPost;
          // Replace placeholder with actual data from API
          const patchResult = dispatch(
            postApi.util.updateQueryData("getPosts", undefined, (draft) => {
              draft.posts[0] = newPost; // Update the first post with the actual post data
            })
          );
        } catch {
          console.log("Error in redux in adding post");
        }
      },
    }),

    deletePost: builder.mutation({
      query: (id) => ({
        url: `/delete-post/${id}`,
        method: "GET",
      }),
      // Optimistic cache update
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postApi.util.updateQueryData("getPosts", undefined, (draft) => {
            draft.posts = draft.posts.filter((post) => post._id !== id);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
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
  useAddPostMutation,
} = postApi;
