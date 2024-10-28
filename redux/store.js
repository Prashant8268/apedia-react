// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { postApi } from "./features/postSlice";
import userReducer from "./features/UserSlice";
import { friendApi } from "./features/FriendSlice";

const store = configureStore({
  reducer: {
    // Adding the postApi reducer
    [postApi.reducerPath]: postApi.reducer,
    [friendApi.reducerPath]: friendApi.reducer,
    user: userReducer,
  },
  // Adding the middleware for RTK Query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(postApi.middleware, friendApi.middleware),
});
export default store;
