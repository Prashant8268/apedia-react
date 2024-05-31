// pages/friends.js

"use client";
import { useState } from 'react';

const Friends = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [friendRequests, setFriendRequests] = useState([
        { id: 1, name: 'Friend Request 1' },
        { id: 2, name: 'Friend Request 2' },
        { id: 3, name: 'Friend Request 3' }
    ]);
    const [friendsList, setFriendsList] = useState([
        { id: 1, name: 'Friend 1' },
        { id: 2, name: 'Friend 2' },
        { id: 3, name: 'Friend 3' }
    ]);

    return (
        <div className="bg-gradient-to-br from-blue-400 to-purple-400 text-white min-h-screen py-8">
            <div className="container mx-auto px-4">
                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search friends..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded mb-4"
                />

                {/* Friend Requests */}
                <div className="mb-8 text-white">
                    <h2 className="text-xl font-bold mb-4">Friend Requests</h2>
                    {friendRequests.map(request => (
                        <div key={request.id} className="flex items-center justify-between bg-gray-100 p-4 rounded shadow-md mb-2">
                            <p className="text-black">{request.name}</p>
                            <div className="space-x-2">
                                <button className="bg-blue-500 text-white px-4 py-2 rounded">Accept</button>
                                <button className="bg-red-500 text-white px-4 py-2 rounded">Reject</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Friends List */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Friends</h2>
                    {friendsList.map(friend => (
                        <div key={friend.id} className="flex items-center justify-between bg-gray-100 p-4 rounded shadow-md mb-2">
                            <p className="text-black">{friend.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Friends;
