// src/components/SearchBar.js
import Link from "next/link";
import { useState, useEffect, useCallback, useMemo } from "react";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]); // State to hold users
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/get-users"); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Correctly parse the response to JSON
        console.log(data, "data at search"); // Log raw data

        // Ensure data structure is correct
        if (data && Array.isArray(data.users)) {
          setUsers(data.users); // Assuming data.users is an array of user objects
          console.log(data.users, "users fetched from API"); // Log fetched users
        } else {
          throw new Error("Unexpected data structure");
        }
      } catch (err) {
        setError(err.message); // Handle error
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchUsers();
  }, []);

  const handleChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  // Use useMemo to memoize filtered users based on search term
  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Log the filtered users to check if filtering is working
  console.log(filteredUsers, "filtered users"); // Log filtered users

  // if (loading) return <p className="text-gray-500">Loading users...</p>; // Loading state
  if (error) return <p className="text-red-500">Error: {error}</p>; // Error handling

  return (
    <div className="relative mb-4 text-black">
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleChange}
        className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {searchTerm && filteredUsers.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg">
          {filteredUsers.map((user) => (
            <Link
              href={`/profile/${user._id}`}
              key={user._id}
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <LazyImage
                src={
                  user.avatarUrl ||
                  "https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
                }
                alt={user.name}
                className="w-8 h-8 rounded-full mr-2"
              />
              <span>{user.name}</span>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

// LazyImage component for lazy loading images
const LazyImage = ({ src, alt, className }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = useCallback(() => {
    const imgElement = document.getElementById(src);
    if (imgElement) {
      const rect = imgElement.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        setIsVisible(true);
        window.removeEventListener("scroll", handleScroll);
      }
    }
  }, [src]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check visibility on mount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <img
      id={src}
      src={isVisible ? src : undefined}
      alt={alt}
      className={className}
    />
  );
};

export default SearchBar;
