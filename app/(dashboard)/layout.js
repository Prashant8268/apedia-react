"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faEnvelopeOpenText,
  faUserFriends,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import AuthProvider from "../_componets/AuthProvider";

export default function RootLayout({ children }) {
  const [activeTab, setActiveTab] = useState("");
  const unreadMessages = 5;
  const pathname = usePathname();
  const userData = useSelector((state) => state.user);


  useEffect(() => {
    const path = pathname.split("/")[1];
    setActiveTab(path || "posts");
  }, [pathname]);

  return (
    <AuthProvider>
      <section>
        {/* Navbar Container */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center py-4 px-6">
            {/* Logo */}
            <h1 className="text-3xl font-extrabold mb-2 md:mb-0 cursor-pointer">
              <span className="text-yellow-400">Apedia</span>
            </h1>

            {/* Navigation Links */}
            <nav className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <Link
                href="/posts"
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                  activeTab === "posts"
                    ? "bg-white text-indigo-600 shadow-md"
                    : "hover:bg-white hover:bg-opacity-20"
                }`}
              >
                <FontAwesomeIcon icon={faHome} className="mr-2" /> Home
              </Link>

              <Link
                href="/messages"
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center relative ${
                  activeTab === "messages"
                    ? "bg-white text-indigo-600 shadow-md"
                    : "hover:bg-white hover:bg-opacity-20"
                }`}
              >
                <FontAwesomeIcon icon={faEnvelopeOpenText} className="mr-2" />
                Messages
                {unreadMessages > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                    {unreadMessages}
                  </span>
                )}
              </Link>

              <Link
                href="/friends"
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                  activeTab === "friends"
                    ? "bg-white text-indigo-600 shadow-md"
                    : "hover:bg-white hover:bg-opacity-20"
                }`}
              >
                <FontAwesomeIcon icon={faUserFriends} className="mr-2" />
                Friends
              </Link>

              {/* Check if userData is available before rendering Profile link */}
              {userData.userData ? (
                <Link
                  href={`/profile/${userData.userData.id}`}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    activeTab === "profile"
                      ? "bg-white text-indigo-600 shadow-md"
                      : "hover:bg-white hover:bg-opacity-20"
                  }`}
                >
                  <FontAwesomeIcon icon={faUserCircle} className="mr-2" />{" "}
                  Profile
                </Link>
              ) : (
                // Optionally, render a placeholder or nothing
                <span className="px-4 py-2">Loading Profile...</span>
              )}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div>{children}</div>
      </section>
    </AuthProvider>
  );
}
