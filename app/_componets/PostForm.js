import React, { useState } from "react";
import axios from "axios";

const PostForm = () => {
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
      // Prepare the form data
      const formData = new FormData();
      formData.append("content", newPostContent);
      if (selectedFile) {
        formData.append("photo", selectedFile);
      }

      // Send the form data to the server
      await axios.post("/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Post submitted successfully!");
      setNewPostContent("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error submitting post:", error);
      setMessage("Failed to submit post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-lg shadow-md mb-6 max-w-md"
      >
        <textarea
          value={newPostContent}
          onChange={handleTextChange}
          placeholder="What's on your mind?"
          className="w-full p-2 border rounded-lg mb-2"
          rows="4"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full mb-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
      {message && <p className="text-center text-red-500">{message}</p>}
    </div>
  );
};

export default PostForm;
