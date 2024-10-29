import React, { useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useAddPostMutation } from "@/redux/features/postSlice";

const PostForm = () => {
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [addPost] = useAddPostMutation();

  const fileInputRef = useRef(null);
  const user = useSelector((state) => state.user);

  const handleTextChange = (e) => {
    setNewPostContent(e.target.value);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("content", newPostContent);
      if (selectedFile) {
        formData.append("photo", selectedFile);
      }
      formData.append("user", user);

      addPost(formData)
      setNewPostContent("");
      setSelectedFile(null);
      fileInputRef.current.value = null;
    } catch (error) {
      console.error("Error submitting post:", error);
      setMessage("Failed to submit post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-lg shadow-md mb-6 max-w-md w-full border border-gray-300"
      >
        <h2 className="text-xl font-semibold text-center mb-3 text-blue-600">
          Create a New Post
        </h2>
        <textarea
          value={newPostContent}
          onChange={handleTextChange}
          placeholder="What's on your mind?"
          className="text-black  w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring focus:ring-blue-300 transition duration-200"
          rows="4"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full mb-3 border border-gray-300 rounded-lg p-2 text-gray-700 cursor-pointer hover:bg-blue-50 transition duration-200"
          ref={fileInputRef}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 w-full"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
        {message && (
          <p
            className={`text-center mt-3 ${
              message.includes("Failed") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default PostForm;
