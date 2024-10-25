// src/app/components/Posts.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PostForm from "../../_componets/PostForm";
import PostItem from "../../_componets/PostItem";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useGetPostsQuery } from "@/redux/features/postSlice";

const Posts = () => {
  const router = useRouter();

  const { data, error, isLoading } = useGetPostsQuery();
  const posts = data ? data.posts : [];
  console.log(posts,' posts');
  function setPosts(){

  }

  // Function to handle post deletion
  const handlePostDeleted = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  // Function to handle user profile click
  const handleProfileClick = (username) => {
    router.push(`/profile/${username}`);
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Posts</h1>
      <PostForm />
      <div className="w-full md:w-1/2 lg:w-1/2 mx-auto">
        {" "}
        {/* This div controls the width */}
        {isLoading ? (
          <div className="flex justify-center items-center h-100">
            <AiOutlineLoading3Quarters className="animate-spin" />
          </div>
        ) : (
          posts.map((post) => (
            <PostItem
              key={post._id}
              post={post}
              onPostDeleted={handlePostDeleted}
              handleProfileClick={handleProfileClick}
              setPosts={setPosts}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Posts;
