import React from "react";

const EditProfileForm = ({
  name,
  setName,
  email,
  setEmail,
  setFile,
  handleUpdateProfile,
  apiLoading,
  setEditing,
}) => (
  <form onSubmit={handleUpdateProfile} className="w-full mt-6">
    <div className="mb-4">
      <label className="block text-gray-700">Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg"
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg"
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700">Avatar</label>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full px-3 py-2 border rounded-lg"
      />
    </div>
    <button
      type="submit"
      className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition"
    >
      {apiLoading ? "Updating..." : "Save Changes"}
    </button>
    <button
      type="button"
      onClick={() => setEditing(false)}
      className="w-full mt-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition"
    >
      Cancel
    </button>
  </form>
);

export default EditProfileForm;
