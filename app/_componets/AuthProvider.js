// AuthProvider.js
"use client";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUserData, clearUser } from "../../redux/features/UserSlice";
import axios from "axios";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      if (true) {
        try {
          const response = await axios.get("/api/get-user");
          console.log(response, 'values at auth')
          if (response.status === 200) {
            dispatch(setUserData(response.data)); 
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          dispatch(clearUser()); 
        }
      }
    };

    checkAuth();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
