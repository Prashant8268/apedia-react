const ProfileActions = ({ onLogout, isLoading }) => (
  <button
    onClick={onLogout}
    className="mt-6 w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition"
  >
    {isLoading ? "Logging Out" : "Logout"}
  </button>
);

export default ProfileActions;
