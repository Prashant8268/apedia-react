"use client";
import { useEffect, useState } from "react";
import Posts from "../posts/page";
import axios from "axios";
import { useRouter } from "next/navigation";

// Mock data fetching function for initial data
const fetchProfileData = async () => {
  const response = await axios.get("/api/get-user");
  return response.data;
};

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchProfileData();
        console.log(data,'data')
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const handleLogout = async () => {
    await axios.get("/api/signout");
    router.push("/signIn");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Error loading profile data.
      </div>
    );
  }

  const { name, email, avatar } = profileData;

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto bg-white text-black p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center">
          <div className="w-32 h-32 rounded-full mb-4 border-4 border-black flex justify-center items-center">
            <img
              src={avatar || "/default-avatar.png"}
              alt={name}
              className="w-28 h-28 rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold text-blue-500">{name}</h1>
          <p className="text-gray-700">{email}</p>

          <div className="w-full mt-6">
            <h3 className="text-xl mb-4">Update Profile</h3>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
            >
              Logout
            </button>

            <form
              action={`/update/${name}`}
              encType="multipart/form-data"
              method="POST"
              className="w-full mt-4"
            >
              <input
                type="text"
                name="name"
                value={name}
                required
                placeholder="Your Name"
                className="w-full p-2 mb-2 border border-gray-300 rounded"
                onChange={(e) =>
                  setProfileData((prevState) => ({
                    ...prevState,
                    name: e.target.value,
                  }))
                }
              />
              <input
                type="email"
                name="email"
                value={email}
                required
                placeholder="Your Email"
                className="w-full p-2 mb-2 border border-gray-300 rounded"
                onChange={(e) =>
                  setProfileData((prevState) => ({
                    ...prevState,
                    email: e.target.value,
                  }))
                }
              />
              <input
                type="file"
                name="avatar"
                placeholder="Profile Picture"
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />
              <input
                type="submit"
                value="Update"
                className="btn-primary mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              />
            </form>
          </div>
        </div>
      </div>
      <Posts />
    </div>
  );
};

export default Profile;
