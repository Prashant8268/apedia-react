import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

const PostHeader = ({ post, handleProfileClick, setPosts }) => {
  const [openPostMenu, setOpenPostMenu] = useState(false);
  const menuRef = useRef(null);
  const postMenuButtonRef = useRef(null);

  const handlePostMenu = () => {
    setOpenPostMenu((prev) => !prev);
  };

  const handleDeletePost = async () => {
    try {
      await axios.get(`/api/delete-post/${post._id}`);
      setPosts((prevPosts) => prevPosts.filter((p) => p._id !== post._id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the menu and button
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        postMenuButtonRef.current &&
        !postMenuButtonRef.current.contains(event.target)
      ) {
        setOpenPostMenu(false);
      }
    };

    // Add event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center">
        <img
          src={`${
            post.user.avatarUrl
              ? post.user.avatarUrl
              : "https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
          }`}
          alt={post.user.name}
          className="w-10 h-10 rounded-full cursor-pointer border border-gray-300"
          onClick={() => handleProfileClick(post.user._id)}
        />
        <p
          className="text-lg font-semibold ml-4 cursor-pointer text-blue-600 hover:text-blue-800"
          onClick={() => handleProfileClick(post.user._id)}
        >
          {post.user.name}
        </p>
      </div>
      <button
        ref={postMenuButtonRef}
        onClick={handlePostMenu}
        className="text-gray-500 hover:text-gray-800 focus:outline-none"
      >
        <FontAwesomeIcon icon={faEllipsisV} />
      </button>
      {openPostMenu && (
        <div
          ref={menuRef}
          className="absolute right-0 top-10 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
        >
          <button
            onClick={handleDeletePost}
            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default PostHeader;
