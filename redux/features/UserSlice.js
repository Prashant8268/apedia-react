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
    updateUserData(state, action) {
      const updates = action.payload; // Expect an object with the fields to update
      if (state.userData) {
        // Merge the updates into the existing userData
        state.userData = {
          ...state.userData,
          ...updates,
        };
      }
    },

    removeFriendship(state, action) {
      const friendIdToRemove = action.payload;
      if (state.userData && state.userData.friends) {
        state.userData.friends = state.userData.friends.filter(
          (friend) => friend._id !== friendIdToRemove
        );
        state.userData.friendRequest = state.userData.friendRequest.filter(
          (friend) => friend._id !== friendIdToRemove
        );
      }
    },
    removeFriend(state, action) {
      const friendIdToRemove = action.payload;
      if (state.userData && state.userData.friendsName) {
        state.userData.friendsName = state.userData.friendsName.filter(
          (friend) => friend._id !== friendIdToRemove
        );
      }
    },
    addFriend(state, action) {
      const newFriend = action.payload;
      if (state.userData && state.userData.friendsName) {
        // Ensure that the friend is not already in the list to avoid duplicates
        const alreadyAdded = state.userData.friendsName.some(
          (friend) => friend._id === newFriend._id
        );

        if (!alreadyAdded) {
          state.userData.friendsName.push(newFriend);
        }
      }
    },
    addFriendship(state, action) {
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

export const {
  setUserId,
  updateUserData,
  setUserData,
  clearUser,
  addFriend,
  addFriendship,
  removeFriend,
  removeFriendship,
} = userSlice.actions;
export default userSlice.reducer;
