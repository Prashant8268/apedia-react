import React from "react";
import Link from "next/link";

const FriendsList = ({
  friends,
  friendRequests,
  onAcceptRequest,
  onRejectRequest,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-semibold mb-4">Friends</h2>

      <h3 className="text-xl font-semibold mb-2">My Friends</h3>
      {friends.length > 0 ? (
        <ul className="list-disc pl-5 space-y-2">
          {friends.map((friend) => (
            <li key={friend._id} className="text-lg">
              <Link
                href={`/profile/${friend.id}`}
                className="text-blue-600 hover:underline"
              >
                {friend.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">You have no friends yet.</p>
      )}

      <h3 className="text-xl font-semibold mt-6 mb-2">Friend Requests</h3>
      {friendRequests.length > 0 ? (
        <ul className="space-y-2">
          {friendRequests.map((request) => (
            <li
              key={request.id}
              className="flex items-center justify-between p-2 border-b"
            >
              <span className="text-lg">{request.name}</span>
              <div>
                <button
                  onClick={() => onAcceptRequest(request.id)}
                  className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md mr-2 transition"
                >
                  Accept
                </button>
                <button
                  onClick={() => onRejectRequest(request.id)}
                  className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md transition"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">You have no friend requests.</p>
      )}
    </div>
  );
};

export default FriendsList;
