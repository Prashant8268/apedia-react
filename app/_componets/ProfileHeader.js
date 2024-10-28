const ProfileHeader = ({ avatarUrl, name, email, onEditClick, isEditing }) => (
  <div className="mx-auto bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-lg flex flex-col items-center">
    <div className="w-32 h-32 rounded-full mb-4 border-4 border-blue-500 flex justify-center items-center">
      <img
        src={
          avatarUrl || "https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
        }
        alt={name}
        className="w-28 h-28 rounded-full object-cover"
      />
    </div>
    {!isEditing ? (
      <>
        <h1 className="text-4xl font-bold text-blue-600 mb-2">{name}</h1>
        <p className="text-lg text-gray-800">{email}</p>
        <button
          onClick={onEditClick}
          className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition"
        >
          Edit Profile
        </button>
      </>
    ) : null}
  </div>
);

export default ProfileHeader;
