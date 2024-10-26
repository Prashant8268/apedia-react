"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import FriendsList from "@/app/_componets/Friends";

const fetchProfileData = async (userId) => {
  const response = await axios.get(`/api/get-user-any/${userId}`);
  return response.data;
};

const fetchFriendsData = async (userId) => {
  const response = await axios.get(`/api/get-friends/${userId}`);
  return response.data;
};

const Profile = ({ params }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [friendshipStatus, setFriendshipStatus] = useState(null);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const router = useRouter();
  const { id } = params;
  const userData = useSelector((state) => state.user.userData);
  const loggedInUserId = userData?.id;

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const profileRes = await fetchProfileData(id);
        setProfileData(profileRes);

        const statusRes = await axios.get(`/api/get-friendship-status`, {
          params: { userId: loggedInUserId, profileId: id },
        });
        setFriendshipStatus(statusRes.data);

        // Fetch friends and friend requests
        const friendsRes = await fetchFriendsData(loggedInUserId);
        setFriends(friendsRes.acceptedFriends);
        setFriendRequests(friendsRes.friendRequests);
      } catch (error) {
        console.error("Error fetching profile or friendship status:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id && loggedInUserId) {
      fetchStatus();
    }
  }, [id, loggedInUserId]);

  const handleLogout = async () => {
    await axios.get("/api/signout");
    Cookies.remove("jwt");
    router.push("/signIn");
  };

  const handleFriendRequest = async (action) => {
    try {
      const response = await axios.post("/api/add-friend", {
        userId: loggedInUserId,
        profileId: id,
        action,
      });

      if (response.status === 200) {
        setFriendshipStatus(
          action === "add"
            ? { status: "request_sent" }
            : action === "cancel"
            ? { status: "not_friends" }
            : action === "accept"
            ? { status: "friends" }
            : { status: "not_friends" }
        );
      }
    } catch (error) {
      console.error("Error handling friend request:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        <div className="loader"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        Error loading profile data.
      </div>
    );
  }

  const { name, email, avatar } = profileData;

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-lg flex flex-col items-center">
          <div className="w-32 h-32 rounded-full mb-4 border-4 border-blue-500 flex justify-center items-center">
            <img
              src={avatar || "/default-avatar.png"}
              alt={name}
              className="w-28 h-28 rounded-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-bold text-blue-600 mb-2">{name}</h1>
          <p className="text-lg text-gray-800">{email}</p>

          <div className="w-full mt-6 space-y-2">
            <h3 className="text-2xl mb-4 text-gray-800">Actions</h3>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition"
            >
              Logout
            </button>

            {friendshipStatus?.status === "not_friends" &&
              loggedInUserId !== id && (
                <button
                  onClick={() => handleFriendRequest("add")}
                  className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition"
                >
                  Add Friend
                </button>
              )}
            {friendshipStatus?.status === "friends" && (
              <button
                onClick={() => handleFriendRequest("remove")}
                className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition"
              >
                Remove Friend
              </button>
            )}
            {friendshipStatus?.status === "request_sent" && (
              <button
                onClick={() => handleFriendRequest("cancel")}
                className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition"
              >
                Cancel Request
              </button>
            )}
            {friendshipStatus?.status === "request_received" && (
              <>
                <button
                  onClick={() => handleFriendRequest("accept")}
                  className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition"
                >
                  Accept Request
                </button>
                <button
                  onClick={() => handleFriendRequest("reject")}
                  className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-md transition"
                >
                  Reject Request
                </button>
              </>
            )}
          </div>
        </div>

        {/* Render the Friends component */}
        <FriendsList
          friends={friends}
          friendRequests={friendRequests}
          onAcceptRequest={handleFriendRequest}
          onRejectRequest={handleFriendRequest}
        />
      </div>
    </div>
  );
};

export default Profile;
