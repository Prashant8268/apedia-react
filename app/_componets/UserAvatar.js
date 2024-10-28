import React from "react";

const UserAvatar = ({ avatarUrl, name }) => (
  <div className="w-32 h-32 rounded-full mb-4 border-4 border-blue-500 flex justify-center items-center">
    <img
      src={
        avatarUrl || "https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
      }
      alt={name}
      className="w-28 h-28 rounded-full object-cover"
    />
  </div>
);

export default UserAvatar;
