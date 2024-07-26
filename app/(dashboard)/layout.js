"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faNewspaper,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const [activeTab, setActiveTab] = useState("");
  const unreadMessages = 5; // Example number of unread messages, replace with actual count
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Update active tab based on the current path
    // Here we expect the path to be like: /posts, /messages, /friends, /profile
    const path = pathname.split("/")[1]; // Adjusted to split the path correctly
    setActiveTab(path || "posts"); // Set default to 'posts' if path is empty
  }, [pathname]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    router.push(`/${tab}`);
  };

  return (
    <section>
      <div className="bg-gradient-to-br from-blue-400 to-purple-400 text-white py-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between mt-2 items-center">
          <h1 className="text-3xl text-blue-500 mb-2 font-bold text-yellow-400">
            Apedia
          </h1>
          <nav className="flex flex-col md:flex-row items-center">
            <button
              onClick={() => handleTabClick("posts")}
              className={`hover:bg-blue-600 px-4 py-2 rounded ${
                activeTab === "posts" ? "bg-blue-700" : ""
              } mb-2 md:mb-0 mr-0 md:mr-2 flex items-center`}
            >
              <FontAwesomeIcon icon={faNewspaper} className="mr-2" /> Posts
            </button>
            <button
              onClick={() => handleTabClick("messages")}
              className={`hover:bg-blue-600 px-4 py-2 rounded relative ${
                activeTab === "messages" ? "bg-blue-700" : ""
              } mb-2 md:mb-0 mr-0 md:mr-2 flex items-center`}
            >
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" /> Messages{" "}
              {unreadMessages > 0 && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-full ml-1">
                  {unreadMessages}
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabClick("friends")}
              className={`hover:bg-blue-600 px-4 py-2 rounded ${
                activeTab === "friends" ? "bg-blue-700" : ""
              } mb-2 md:mb-0 mr-0 md:mr-2 flex items-center`}
            >
              <FontAwesomeIcon icon={faUsers} className="mr-2" /> My Friends
            </button>
            <button
              onClick={() => handleTabClick("profile")}
              className={`hover:bg-blue-600 px-4 py-2 rounded ${
                activeTab === "profile" ? "bg-blue-700" : ""
              } mb-2 md:mb-0 flex items-center`}
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" /> My Profile
            </button>
          </nav>
        </div>
      </div>
      <div>{children}</div>
    </section>
  );
}
