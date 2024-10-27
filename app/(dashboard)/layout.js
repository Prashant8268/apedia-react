"use client";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faEnvelopeOpenText,
  faUserFriends,
  faUserCircle,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import AuthProvider from "../_componets/AuthProvider";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }) {
  const [activeTab, setActiveTab] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const unreadMessages = 5;
  const pathname = usePathname();
  const userData = useSelector((state) => state.user.userData);
  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const path = pathname.split("/")[1];
    setActiveTab(path || "posts");
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    router.push("/signout");
  };

  return (
    <AuthProvider>
      <section className="bg-gradient-to-br from-purple-800 to-blue-600 min-h-screen text-white">
        {/* Navbar Container */}
        <div className="container mx-auto py-4 px-6 shadow-md rounded-b-lg bg-opacity-90 backdrop-filter backdrop-blur-md">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Logo */}
            <h1 className="text-4xl font-extrabold text-yellow-300 cursor-pointer mb-4 md:mb-0">
              <span className="text-yellow-300">A</span>
              <span className="text-pink-400">p</span>
              <span className="text-yellow-300">e</span>
              <span className="text-pink-400">d</span>
              <span className="text-yellow-300">i</span>
              <span className="text-pink-400">a</span>
            </h1>

            {/* Navigation Links */}
            <nav className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-6">
              <Link
                href="/posts"
                className={`px-5 py-3 rounded-full transition-all duration-300 flex items-center ${
                  activeTab === "posts"
                    ? "bg-white text-blue-600 shadow-lg"
                    : "hover:bg-white hover:bg-opacity-10"
                } font-semibold`}
              >
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                Home
              </Link>

              <Link
                href="/messages"
                className={`px-5 py-3 rounded-full transition-all duration-300 flex items-center relative ${
                  activeTab === "messages"
                    ? "bg-white text-blue-600 shadow-lg"
                    : "hover:bg-white hover:bg-opacity-10"
                } font-semibold`}
              >
                <FontAwesomeIcon icon={faEnvelopeOpenText} className="mr-2" />
                Messages
                {unreadMessages > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full -mt-1 -mr-2">
                    {unreadMessages}
                  </span>
                )}
              </Link>

              <Link
                href="/friends"
                className={`px-5 py-3 rounded-full transition-all duration-300 flex items-center ${
                  activeTab === "friends"
                    ? "bg-white text-blue-600 shadow-lg"
                    : "hover:bg-white hover:bg-opacity-10"
                } font-semibold`}
              >
                <FontAwesomeIcon icon={faUserFriends} className="mr-2" />
                Friends
              </Link>

              {/* Profile link with dropdown for logout */}
              {userData ? (
                <div className="relative flex items-center">
                  <Link
                    href={`/profile/${userData.id}`}
                    className={`px-5 py-3 rounded-full transition-all duration-300 flex items-center ${
                      activeTab === "profile"
                        ? "bg-white text-blue-600 shadow-lg"
                        : "hover:bg-white hover:bg-opacity-10"
                    } font-semibold`}
                  >
                    <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                    Profile
                  </Link>
                  <FontAwesomeIcon
                    icon={faEllipsisV}
                    className="ml-2 cursor-pointer"
                    onClick={() => setDropdownVisible((prev) => !prev)}
                  />
                  {dropdownVisible && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg z-10 text-gray-800"
                    >
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <span className="px-4 py-2">Loading Profile...</span>
              )}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 rounded-lg shadow-lg">{children}</div>
      </section>
    </AuthProvider>
  );
}
