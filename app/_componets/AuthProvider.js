// AuthProvider.js
"use client";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUserData, clearUser } from "../../redux/features/UserSlice";
import axios from "axios";
import { useRouter } from "next/navigation";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/get-user");
        console.log(response, "values at auth");
        if (response.status === 200) {
          dispatch(setUserData(response.data));
        } else {
          router.push("/signIn");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        dispatch(clearUser());
        router.push("/signIn"); // Push to signIn if there's an error
      }
    };

    checkAuth();
  }, [dispatch, router]);

  return <>{children}</>;
};

export default AuthProvider;
