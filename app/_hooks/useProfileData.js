import { useEffect, useState } from "react";
import axios from "axios";

export const useProfileData = (id, loggedInUserId, userData) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async (userId) => {
      const response = await axios.get(`/api/get-user-any/${userId}`);
      return response.data;
    };

    const fetchStatus = async () => {
      try {
        if (id === loggedInUserId) {
          setProfileData(userData);
        } else {
          const profileRes = await fetchProfileData(id);
          setProfileData(profileRes);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id && loggedInUserId) {
      fetchStatus();
    }
  }, [id, loggedInUserId, userData]);

  return { profileData, loading, setProfileData };
};
