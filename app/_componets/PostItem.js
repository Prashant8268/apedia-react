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
import { useSelector } from "react-redux";
import PostActions from "./PostActions"; // Import PostActions component
import { useToggleLikeMutation } from "@/redux/features/postSlice";
import PostContent from "./PostContent";
import PostHeader from "./PostHeader";
const PostItem = ({ post: initialPost, setPosts, handleProfileClick }) => {
  const [post, setPost] = useState(initialPost);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const [openComments, setOpenComments] = useState(false);
  const [openPostMenu, setOpenPostMenu] = useState(false);
  const menuRef = useRef(null);
  const postMenuButtonRef = useRef(null);
  const userData = useSelector((state) => state.user.userData);
  const userId = userData?.id;

  const [isPostLiked, setIsPostLiked] = useState(
    post.likes.some((like) => like.user?._id === userId)
  );

  useEffect(() => {
    setPost(initialPost);
  }, [initialPost]);

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

  const [toggleLike] = useToggleLikeMutation();

  const handleLikePost = async () => {
    try {
      const response = await toggleLike({ id: post._id}).unwrap();
      setPost(response.data.likeable);
      setIsPostLiked((prev) => !prev);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`/api/delete-post/${post._id}`);
      setPosts((prevPosts) => prevPosts.filter((p) => p._id !== post._id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post("/api/add-comment", {
        postId: post._id,
        text: newComment,
      });
      const createdComment = response.data.comment;
      setComments((prevComments) => [...prevComments, createdComment]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 relative ">
      <PostHeader post={post} handleProfileClick={handleProfileClick} />
      <PostContent post={post} />
      <PostActions
        post={post}
        handleLikePost={handleLikePost}
        isPostLiked={isPostLiked}
        openComments={openComments}
        setOpenComments={setOpenComments}
        comments={comments}
        handleAddComment={handleAddComment}
        newComment={newComment}
        setNewComment={setNewComment}
      />
    </div>
  );
};

export default PostItem;
