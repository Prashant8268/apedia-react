"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // State to track error message
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(""); 

      const response = await axios.post("/api/signin", { email, password });
      if (response.status === 200) {
        localStorage.setItem("jwt", response.data.jwt);
        router.push("/posts");
      } else {
        setError("Invalid email or password."); // Set error if response is not 200
      }
    } catch (error) {
      console.error(error, "error");
      setIsLoading(false);
      setError("Invalid email or password."); // Set error on request failure
    }
  };

  return (
    <div
      className="flex justify-center items-center pt-10 pb-5 min-h-screen bg-gradient-to-br
         from-blue-400 to-purple-500"
    >
      <div className="bg-white max-w-md p-8 rounded-lg shadow-md">
        <h1 className="text-3xl text-blue-500 mb-6 text-center">
          Sign In to <span className="text-yellow-400">Apedia</span>
        </h1>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full py-2 focus:outline-none"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded px-3">
              <FontAwesomeIcon
                icon={faLock}
                className="text-gray-400 mr-2 w-6 h-6"
              />
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full py-2 focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full mb-2 bg-blue-500 text-white font-semibold
                        py-2 px-4 rounded-md transition duration-300 ease-in-out hover:bg-blue-600
                        focus:outline-none focus:bg-blue-600"
          >
            {isLoading ? "Logging in..." : "Sign In"}
          </button>
        </form>
        <div className="flex justify-center items-center mt-4">
          <Link href="/signUp" className="mr-2 text-blue-500 font-semibold">
            Sign Up
          </Link>
          <span className="text-gray-400">|</span>
          <Link
            href="/forgotPassword"
            className="ml-2 text-blue-500 font-semibold"
          >
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
