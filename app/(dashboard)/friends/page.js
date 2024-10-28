"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faUser } from "@fortawesome/free-solid-svg-icons";
import { useFetchFriendsQuery } from "@/redux/features/FriendSlice";
import SearchBar from "@/app/_componets/SearchBar"; // Import the SearchBar component
import Link from "next/link"; // Import Link from Next.js
import { FaSpinner } from "react-icons/fa";
const Friends = () => {
  const router = useRouter();

  // Fetch user data from Redux store
  const userData = useSelector((state) => state.user.userData);

  const {
    data: friendsData,
    isLoading,
    error,
  } = useFetchFriendsQuery(userData?.id, {
    skip: !userData?.id,
  });
  console.log(friendsData, "data");

  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (friendsData) {
      setFriendRequests(friendsData.friendRequests || []);
      setFriends(friendsData.friends || []);
    }
  }, [friendsData]);

  const handleAccept = (id) => {
    const acceptedFriend = friendRequests.find((request) => request.id === id);
    setFriends([...friends, acceptedFriend]);
    setFriendRequests(friendRequests.filter((request) => request.id !== id));
  };

  const handleReject = (id) => {
    setFriendRequests(friendRequests.filter((request) => request.id !== id));
  };

  const handleProfileClick = (username) => {
    router.push(`/profile/${username}`);
  };
  return (
    <div className="bg-gray-50 p-6 rounded-lg flex justify-center">
      <div className="max-w-md w-full">
        {/* Search Bar Section */}
        <SearchBar />
        {isLoading ? (
          <div className="flex justify-center items-center h-screen text-gray-700">
            <div className="loader">
              <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
          </div>
        ) : (
          <>
            {/* Friend Requests Section */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Friend Requests
              </h2>
              {friendRequests.length === 0 ? (
                <p className="text-gray-500">No friend requests.</p>
              ) : (
                friendRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between mb-4 p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <div className="flex items-center">
                      <img
                        src={request.profilePic}
                        alt={request.username}
                        className="w-10 h-10 rounded-full cursor-pointer border border-gray-300"
                        onClick={() => handleProfileClick(request.username)}
                      />
                      <p
                        className="text-lg font-semibold ml-4 cursor-pointer text-gray-800"
                        onClick={() => handleProfileClick(request.username)}
                      >
                        {request.username}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleAccept(request.id)}
                        className="text-green-500 hover:text-green-700"
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Friends List Section */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Friends List
              </h2>
              {friends.length === 0 ? (
                <p className="text-gray-500">No friends added.</p>
              ) : (
                friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center justify-between mb-4 p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <Link
                      href={`/profile/${friend._id}`}
                      className="flex items-center"
                    >
                      <img
                        src={friend.avatarUrl}
                        alt={friend.name}
                        className="w-10 h-10 rounded-full cursor-pointer border border-gray-300"
                      />
                      <p className="text-lg font-semibold ml-4 cursor-pointer text-gray-800">
                        {friend.name}
                      </p>
                    </Link>
                    <Link href={`/profile/${friend._id}`}>
                      <button className="text-gray-500 hover:text-gray-700">
                        <FontAwesomeIcon icon={faUser} />
                      </button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Friends;
