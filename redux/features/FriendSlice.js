import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const friendApi = createApi({
  reducerPath: "friendApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Friend", "FriendRequest"],
  endpoints: (builder) => ({
    fetchFriends: builder.query({
      query: (id) => `get-friends/${id}`, 
      transformResponse: (response) => {
        if (response?.data) {
          return {
            friends: response.data.friends || [], 
            friendRequests: response.data.friendRequests || [], 
          };
        }
        return { friends: [], friendRequests: [] };
      },
      providesTags: (result) =>
        result
          ? [
              // Tagging friends
              ...result.friends.map(({ id }) => ({ type: "Friend", id })), // Accessing result.friends
              // Tagging friend requests
              ...result.friendRequests.map(({ id }) => ({
                type: "FriendRequest",
                id,
              })), // Accessing result.friendRequests
            ]
          : ["Friend", "FriendRequest"],
    }),
    acceptFriendRequest: builder.mutation({
      query: (friendId) => ({
        url: `friends/accept/${friendId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, friendId) => [
        { type: "FriendRequest", id: friendId },
      ],
    }),

    rejectFriendRequest: builder.mutation({
      query: (friendId) => ({
        url: `friends/reject/${friendId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, friendId) => [
        { type: "FriendRequest", id: friendId },
      ],
    }),
  }),
});

export const {
  useFetchFriendsQuery,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
} = friendApi;
