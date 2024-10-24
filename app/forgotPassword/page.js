"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("/api/forgot-password", { email });
      const data = res.data;

      if (data.status === 200) {
        setSuccess(true);
        setMessage("Reset link sent to your email address.");

        // Redirect to sign-in page after 3 seconds
        setTimeout(() => {
          router.push("/signIn");
        }, 3000);
      } else {
        setMessage(data.message || "Error sending reset email.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center pt-10 pb-5 min-h-screen bg-gradient-to-br from-blue-400 to-purple-500">
      <div className="bg-white max-w-md p-8 rounded-lg shadow-md">
        {!success ? (
          <>
            <h1 className="text-3xl text-blue-500 mb-6 text-center">
              Forgot Password
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="text-gray-700">
                  Email
                </label>
                <div className="flex items-center border border-gray-300 rounded px-3">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-gray-400 mr-2 w-6 h-6"
                  />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-2 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Sending..." : "Submit"}
              </button>
            </form>
            {message && (
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
          </>
        ) : (
          <div className="text-center">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-green-500 text-6xl"
            />
            <p className="text-green-500 text-xl mt-4">
              Reset link sent to your email address.
            </p>
            <p className="text-gray-500 mt-2">Redirecting to sign-in page...</p>
          </div>
        )}
        {!success && (
          <div className="flex justify-center items-center mt-4">
            <Link href="/signIn" className="text-blue-500 font-semibold">
              Sign In
            </Link>
            <span className="text-gray-400 mx-2">|</span>
            <Link href="/signUp" className="text-blue-500 font-semibold">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
