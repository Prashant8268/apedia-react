"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const ResetPassword = () => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Check if the window is defined to ensure client-side execution
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const tokenValue = searchParams.get("token");
      setToken(tokenValue);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/reset-password", { token, password });
      const data = await res.data;
      if (data.status === 200) {
        setMessage(
          "Password has been reset successfully. Redirecting to sign in..."
        );
        setTimeout(() => router.push("/signIn"), 3000);
      } else {
        setMessage(data.message || "Error resetting password.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="transition ease-in-out duration-300 flex justify-center items-center pt-10 pb-5 min-h-screen bg-gradient-to-br from-blue-400 to-purple-500">
      <div className="bg-white max-w-md p-8 rounded-lg shadow-md">
        <h1 className="text-3xl text-blue-500 mb-6 text-center">
          Reset Password
        </h1>
        {message.includes("successfully") ? (
          <div className="text-center">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-green-500 w-16 h-16 mb-4"
              size="3x"
            />
            <p className="text-green-500">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4 relative">
              <label htmlFor="password" className="text-gray-700">
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-2 py-2 border border-gray-300 rounded focus:outline-none"
                required
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                onClick={toggleShowPassword}
                className="absolute right-3 top-8 text-gray-400 cursor-pointer"
              />
            </div>
            <div className="mb-4 relative">
              <label htmlFor="confirmPassword" className="text-gray-700">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-2 py-2 border border-gray-300 rounded focus:outline-none"
                required
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
                onClick={toggleShowConfirmPassword}
                className="absolute right-3 top-8 text-gray-400 cursor-pointer"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
        {message && !message.includes("successfully") && (
          <div className="mt-4 text-center">
            <p
              className={`text-${
                message.includes("Error") ? "red" : "green"
              }-500`}
            >
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
