const ProfileEditForm = ({
  name,
  setName,
  email,
  setEmail,
  file,
  setFile,
  onSubmit,
  isLoading,
}) => (
  <form onSubmit={onSubmit} className="w-full mt-6">
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
      {isLoading ? "Updating..." : "Save Changes"}
    </button>
  </form>
);

export default ProfileEditForm;
