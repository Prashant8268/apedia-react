// src/app/components/Posts.js
"use client";
import { useRouter } from "next/navigation";
import PostForm from "../../_componets/PostForm";
import PostItem from "../../_componets/PostItem";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useGetPostsQuery } from "@/redux/features/postSlice";

const Posts = () => {
  const router = useRouter();
  const { data, error, isLoading } = useGetPostsQuery();
  const posts = data ? data.posts : [];

  // Function to handle post deletion
  const handlePostDeleted = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  // Function to handle user profile click
  const handleProfileClick = (username) => {
    router.push(`/profile/${username}`);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen p-8 rounded-lg shadow-md">
      <PostForm />
      <h2 className="text-2xl font-semibold text-center text-blue-600 mt-6 mb-4">
        Latest Posts
      </h2>
      <div className="w-full md:w-3/4 lg:w-1/3 mx-auto space-y-4">
        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <AiOutlineLoading3Quarters
              className="animate-spin text-blue-600"
              size={40}
            />
          </div>
        ) : (
          posts.map((post) => (
            <PostItem
              key={post._id}
              post={post}
              onPostDeleted={handlePostDeleted}
              handleProfileClick={handleProfileClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Posts;
