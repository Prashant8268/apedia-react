import React, { useState, useRef } from "react"; // Import useRef to reference the file input
import axios from "axios";

const PostForm = () => {
  // State hooks for managing post content, file selection, loading state, and messages
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Create a ref to access the file input directly
  const fileInputRef = useRef(null);

  // Handle text change in the textarea
  const handleTextChange = (e) => {
    setNewPostContent(e.target.value);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true

    try {
      // Create FormData object to hold form values
      const formData = new FormData();
      formData.append("content", newPostContent);
      if (selectedFile) {
        formData.append("photo", selectedFile);
      }

      // Retrieve JWT token from local storage
      const token = localStorage.getItem("jwt");

      // Send POST request to the API
      const response = await axios.post("/api/newPost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Post submitted successfully!");
      setNewPostContent("");
      setSelectedFile(null);

      // Reset the file input
      fileInputRef.current.value = null; // Reset the file input field
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
          ref={fileInputRef} // Attach the ref to the file input
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          disabled={loading} // Disable button while loading
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
      {message && <p className="text-center text-red-500">{message}</p>}{" "}
      {/* Display message */}
    </div>
  );
};

export default PostForm;
