"use client";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faTrash,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Island_Moments } from "next/font/google";

const PostItem = ({ post, setPosts, handleProfileClick }) => {
  const [openComments, setOpenComments] = useState(false);
  const [commentsToShow, setCommentsToShow] = useState(2);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const [openPostMenu, setOpenPostMenu] = useState(false);
  const menuRef = useRef(null);
  const postMenuButtonRef = useRef(null);
  const jwt = localStorage.getItem("jwt");
  const decodedToken = jwt ? JSON.parse(atob(jwt.split(".")[1])) : null;
  const userId = decodedToken.userId;
  const [isPostLiked, setIsPostLiked] = useState(
    post.likes.some((like) => like.user?._id === userId)
  );
  useEffect(() => {
    setComments(post.comments);
  }, [post]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        postMenuButtonRef.current &&
        !postMenuButtonRef.current.contains(event.target)
      ) {
        setOpenPostMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePostMenu = () => {
    setOpenPostMenu((prev) => !prev);
  };

  const handleLikePost = async () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    try {
      const response = await axios.post("/api/toggle-like", {
        id: post._id,
        token: jwt,
        type: "Post",
      });
      const updatedPost = response.data.data.likeable;
      // Update post's like count
      setIsPostLiked((prev) => !prev);
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p._id === updatedPost._id ? updatedPost : p))
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleSeeMore = () => {
    setCommentsToShow((prev) => prev + 2);
  };

  const handleDeletePost = async () => {
    try {
      await axios.get(`/api/delete-post/${post._id}`);
      setPosts((prevPosts) => prevPosts.filter((p) => p._id !== post._id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    try {
      const jwt = localStorage.getItem("jwt");
      const response = await axios.post("/api/add-comment", {
        postId: post._id,
        text: newComment,
        token: jwt,
      });

      const createdComment = response.data.comment;

      setComments((prevComments) => [...prevComments, createdComment]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 relative transition-transform transform hover:scale-105">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <img
            src={post.profilePic}
            alt={post.user.name}
            className="w-10 h-10 rounded-full cursor-pointer border border-gray-300"
            onClick={() => handleProfileClick(post.user.name)}
          />
          <p
            className="text-lg font-semibold ml-4 cursor-pointer hover:text-blue-600"
            onClick={() => handleProfileClick(post.user.name)}
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
      <p className="text-gray-800 mb-2">{post.content}</p>
      {post.photoUrl && (
        <img
          src={post.photoUrl}
          alt="Post"
          className="w-full h-auto mb-4 rounded-lg object-cover shadow-md"
        />
      )}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleLikePost}
            className={`flex items-center text-gray-500 ${
              isPostLiked ? "text-red-500" : "text-black"
            }`}
          >
            <FontAwesomeIcon icon={faHeart} className="mr-1" />{" "}
            {post.likes.length}
          </button>
          <button
            onClick={() => {
              setOpenComments(!openComments);
              setCommentsToShow(2);
            }}
            className={`flex items-center text-gray-500 ${
              openComments ? "text-blue-500" : "text-black"
            }`}
          >
            <FontAwesomeIcon icon={faComment} className="mr-1" />{" "}
            {comments.length} Comments
          </button>
        </div>
      </div>
      {openComments && (
        <div className="bg-gray-100 rounded-lg p-4 mt-4 max-w-xl max-h-60 overflow-y-auto custom-scrollbar">
          {comments.length === 0 ? (
            <p className="text-gray-600">No comments to show.</p>
          ) : (
            comments.slice(0, commentsToShow).map((comment) => (
              <div
                key={comment._id}
                className="flex items-start space-x-2 mb-2 last:mb-0"
              >
                <div className="flex-grow">
                  <p className="text-sm font-semibold">{comment.user.name}</p>
                  <p className="text-gray-600">{comment.content}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleLikeComment(comment._id)}
                    className={`text-gray-500 ${
                      likedPosts.includes(comment._id)
                        ? "text-red-500"
                        : "text-black"
                    }`}
                  >
                    <FontAwesomeIcon icon={faHeart} /> {comment.likes.length}
                  </button>
                  <button
                    onClick={() => {
                      setComments((prev) =>
                        prev.filter((c) => c._id !== comment._id)
                      );
                    }}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))
          )}
          {commentsToShow < comments.length && (
            <button
              onClick={handleSeeMore}
              className="text-blue-500 hover:underline mt-2"
            >
              See More
            </button>
          )}
          <form onSubmit={handleAddComment} className="mt-4 flex items-center">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-grow p-2 border rounded-md focus:outline-none focus:border-blue-400"
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostItem;
