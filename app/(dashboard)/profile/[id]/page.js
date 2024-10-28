// Import necessary dependencies
"use client";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import {
  removeFriendship,
  removeFriend,
  setUserData,
  updateUserData,
  addFriend,
  addFriendship,
} from "@/redux/features/UserSlice";
import { FaSpinner } from "react-icons/fa";

import UserAvatar from "@/app/_componets/UserAvatar";
import EditProfileForm from "@/app/_componets/ProfileEditForm";
import { useProfileData } from "@/app/_hooks/useProfileData";
import ConfirmationModal from "@/app/_componets/ConfirModal";

const Profile = ({ params }) => {
  const [editing, setEditing] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  const router = useRouter();
  const { id } = params;
  const userData = useSelector((state) => state.user.userData);
  const loggedInUserId = userData?.id;
  const dispatch = useDispatch();

  const { profileData, loading, setProfileData } = useProfileData(
    id,
    loggedInUserId,
    userData
  );
  const [name, setName] = useState(profileData?.name || "");
  const [email, setEmail] = useState(profileData?.email || "");
  const [isFriend, setIsFriend] = useState(false);
  const [sentRequest, setSentRequest] = useState(false);
  const [receivedRequest, setReceivedRequest] = useState(false);
  const [friendshipId, setFriendshipId] = useState(null);

  useEffect(() => {
    if (profileData) {
      setName(profileData.name);
      setEmail(profileData.email);
      userData?.friendsName?.forEach((req) => {
        if (req._id == id) {
          setIsFriend(true);
        }
      });
      userData?.friends?.forEach((req) => {
        if (req.from_user._id === id && req.to_user === loggedInUserId) {
          setReceivedRequest(true);
          setFriendshipId(req._id);
        }
        if (req.from_user._id === loggedInUserId && req.to_user === id) {
          setSentRequest(true);
          setFriendshipId(req._id);
        }
      });
    }
  }, [profileData, userData, loggedInUserId, id]);

  const handleAddFriend = async () => {
    try {
      const res = await axios.post("/api/add-friend", {
        userId: loggedInUserId,
        profileId: id,
        action: "add",
      });
      setSentRequest(true);
      setFriendshipId(res.data.new_friendship._id);
      dispatch(addFriendship(res.data.new_friendship));
    } catch (err) {
      console.log(err, "Error in adding Friend");
    }
  };

  const handleCancelRequest = async () => {
    try {
      const res = await axios.post("/api/add-friend", {
        friendshipId,
        action: "cancel",
        userId: loggedInUserId,
        profileId: id,
      });
      dispatch(removeFriendship(friendshipId));
      // setReceivedRequest(false);
      setSentRequest(false);
    } catch (err) {
      console.log(err, "Error in cancelling request");
    }
  };

  const handleAcceptRequest = async () => {
    try {
      const res = await axios.post("/api/add-friend", {
        friendshipId,
        userId: loggedInUserId,
        profileId: id,
        action: "accept",
      });
      setReceivedRequest(false);
      dispatch(addFriend(res.data.newFriend));
      setIsFriend(true);
    } catch (err) {
      console.log(err, "Error in accepting Request");
    }
  };

  const handleRemoveFriend = () => {
    // Show the confirmation modal
    setShowModal(true);
  };

  const confirmRemoveFriend = async () => {
    try {
      const res = await axios.post("/api/add-friend", {
        action: "remove",
        userId: loggedInUserId,
        profileId: id,
      });
      if (res.status === 200) {
        dispatch(removeFriend(id));
        setReceivedRequest(false);
        setSentRequest(false);
        setIsFriend(false);
      }
    } catch (err) {
      console.log(err, "Error in removing friend");
    }
    setShowModal(false); // Hide modal after confirmation
  };

  const cancelRemoveFriend = () => {
    setShowModal(false); // Hide modal on cancel
  };

  const handleLogout = useCallback(async () => {
    setApiLoading(true);
    await axios.get("/api/signout");
    Cookies.remove("jwt");
    router.push("/signIn");
    setApiLoading(false);
  }, [router]);

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
        dispatch(updateUserData(response.data.user));
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
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
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

  return (
    <div className="bg-gray-100 rounded-lg py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-lg flex flex-col items-center">
          <UserAvatar
            avatarUrl={profileData.avatarUrl}
            name={profileData.name}
          />
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            {profileData.name}
          </h1>
          <p className="text-lg text-gray-800">{profileData.email}</p>

          {loggedInUserId !== id && (
            <>
              {isFriend ? (
                <button
                  onClick={handleRemoveFriend}
                  className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition"
                >
                  Remove Friend
                </button>
              ) : sentRequest ? (
                <button
                  onClick={handleCancelRequest}
                  className="mt-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition"
                >
                  Cancel Request
                </button>
              ) : receivedRequest ? (
                <>
                  <button
                    onClick={handleAcceptRequest}
                    className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition"
                  >
                    Accept Request
                  </button>
                  <button
                    onClick={handleCancelRequest}
                    className="mt-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition"
                  >
                    Reject Request
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAddFriend}
                  className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition"
                >
                  Add Friend
                </button>
              )}
            </>
          )}

          {!editing ? (
            <>
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
            <EditProfileForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              setFile={setFile}
              handleUpdateProfile={handleUpdateProfile}
              apiLoading={apiLoading}
              setEditing={setEditing}
            />
          )}

          {/* Render the ConfirmationModal */}
          {showModal && (
            <ConfirmationModal
              message="Are you sure you want to remove this friend?"
              onConfirm={confirmRemoveFriend}
              onCancel={cancelRemoveFriend}
            />
          )}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="mt-6 w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
