"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import FriendsList from "@/app/_componets/Friends";
import { setUserData } from "@/redux/features/UserSlice";
import { FaSpinner } from "react-icons/fa";

// Memoize API fetch functions
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
  const [editing, setEditing] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [friendshipStatus, setFriendshipStatus] = useState(null);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const router = useRouter();
  const { id } = params;
  const userData = useSelector((state) => state.user.userData);
  const loggedInUserId = userData?.id;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const profileRes = await fetchProfileData(id);
        setProfileData(profileRes);
        setName(profileRes.name);
        setEmail(profileRes.email);

        const statusRes = await axios.get(`/api/get-friendship-status`, {
          params: { userId: loggedInUserId, profileId: id },
        });
        setFriendshipStatus(statusRes.data);

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

  // Memoize profileData to avoid re-computing on every render
  const memoizedProfileData = useMemo(() => profileData, [profileData]);

  // Logout handler with useCallback
  const handleLogout = useCallback(async () => {
    setApiLoading(true);
    await axios.get("/api/signout");
    Cookies.remove("jwt");
    router.push("/signIn");
    setApiLoading(false);
  }, [router]);

  // Memoize handleFriendRequest to avoid re-creating on every render
  const handleFriendRequest = useCallback(
    async (action) => {
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
    },
    [loggedInUserId, id]
  );

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("userId", id);
    if (file) {
      formData.append("avatar", file);
    }

    try {
      setApiLoading(true);
      const response = await axios.post(`/api/update-profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setProfileData(response.data.user);
        dispatch(setUserData(response.data.user));
        setEditing(false);
        setApiLoading(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        <div className="loader">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      </div>
    );
  }

  if (!memoizedProfileData) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        Error loading profile data.
      </div>
    );
  }

  const { avatarUrl } = memoizedProfileData;

  return (
    <div className="bg-gray-100  rounded-lg py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-lg flex flex-col items-center">
          <div className="w-32 h-32 rounded-full mb-4 border-4 border-blue-500 flex justify-center items-center">
            <img
              src={
                avatarUrl ||
                "https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
              }
              alt={name}
              className="w-28 h-28 rounded-full object-cover"
            />
          </div>
          {!editing ? (
            <>
              <h1 className="text-4xl font-bold text-blue-600 mb-2">{name}</h1>
              <p className="text-lg text-gray-800">{email}</p>
              {loggedInUserId === id && (
                <button
                  onClick={() => setEditing(true)}
                  className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition"
                >
                  Edit Profile
                </button>
              )}
            </>
          ) : (
            <form onSubmit={handleUpdateProfile} className="w-full mt-6">
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Avatar</label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition"
              >
                {apiLoading ? "Updating..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="w-full mt-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition"
              >
                Cancel
              </button>
            </form>
          )}

          <button
            onClick={handleLogout}
            className="mt-6 w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition"
          >
            {apiLoading?"Logging Out":"Logout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
