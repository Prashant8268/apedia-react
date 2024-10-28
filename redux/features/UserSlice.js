import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
  },
  reducers: {
    setUserId(state, action) {
      state.userId = action.payload;
    },
    setUserData(state, action) {
      state.userData = action.payload;
    },
    clearUser(state) {
      state.userId = null;
      state.userData = null;
    },
    removeFriend(state, action) {
      const friendIdToRemove = action.payload;
      if (state.userData && state.userData.friends) {
        state.userData.friends = state.userData.friends.filter(
          (friend) => friend._id !== friendIdToRemove
        );
      }
    },
    addFriend(state, action) {
      const newFriend = action.payload;
      if (state.userData && state.userData.friends) {
        // Ensure that the friend is not already in the list to avoid duplicates
        const alreadyAdded = state.userData.friends.some(
          (friend) => friend._id === newFriend._id
        );

        if (!alreadyAdded) {
          state.userData.friends.push(newFriend);
        }
      }
    },
  },
});

export const { setUserId, setUserData, clearUser,addFriend, removeFriend } =
  userSlice.actions;
export default userSlice.reducer;
