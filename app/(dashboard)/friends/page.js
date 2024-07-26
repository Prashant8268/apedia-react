"use client"
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

const Friends = () => {
    const router = useRouter();

    // Dummy data for friend requests and friend list
    const [friendRequests, setFriendRequests] = useState([
        { id: 1, username: 'Alice', profilePic: 'https://via.placeholder.com/50' },
        { id: 2, username: 'Bob', profilePic: 'https://via.placeholder.com/50' },
    ]);
    const [friends, setFriends] = useState([
        { id: 3, username: 'Charlie', profilePic: 'https://via.placeholder.com/50' },
        { id: 4, username: 'Dave', profilePic: 'https://via.placeholder.com/50' },
    ]);

    // Function to handle accept friend request
    const handleAccept = (id) => {
        const acceptedFriend = friendRequests.find(request => request.id === id);
        setFriends([...friends, acceptedFriend]);
        setFriendRequests(friendRequests.filter(request => request.id !== id));
    };

    // Function to handle reject friend request
    const handleReject = (id) => {
        setFriendRequests(friendRequests.filter(request => request.id !== id));
    };

    // Function to handle user profile click
    const handleProfileClick = (username) => {
        router.push(`/profile/${username}`);
    };

    return (
        <div className="bg-gray-100 p-6 rounded-lg flex justify-center">
            <div className="max-w-md w-full">
                <h1 className="text-3xl font-bold mb-6 text-center">Friends</h1>

                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold mb-4">Friend Requests</h2>
                    {friendRequests.length === 0 ? (
                        <p className="text-gray-600">No friend requests.</p>
                    ) : (
                        friendRequests.map(request => (
                            <div key={request.id} className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <img
                                        src={request.profilePic}
                                        alt={request.username}
                                        className="w-10 h-10 rounded-full cursor-pointer border border-black border-opacity-100"
                                        onClick={() => handleProfileClick(request.username)}
                                    />
                                    <p
                                        className="text-lg font-semibold ml-4 cursor-pointer"
                                        onClick={() => handleProfileClick(request.username)}
                                    >
                                        {request.username}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => handleAccept(request.id)} className="text-green-500 hover:text-green-700">
                                        <FontAwesomeIcon icon={faCheck} />
                                    </button>
                                    <button onClick={() => handleReject(request.id)} className="text-red-500 hover:text-red-700">
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Friends List</h2>
                    {friends.length === 0 ? (
                        <p className="text-gray-600">No friends added.</p>
                    ) : (
                        friends.map(friend => (
                            <div key={friend.id} className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <img
                                        src={friend.profilePic}
                                        alt={friend.username}
                                        className="w-10 h-10 rounded-full cursor-pointer border border-black border-opacity-100"
                                        onClick={() => handleProfileClick(friend.username)}
                                    />
                                    <p
                                        className="text-lg font-semibold ml-4 cursor-pointer"
                                        onClick={() => handleProfileClick(friend.username)}
                                    >
                                        {friend.username}
                                    </p>
                                </div>
                                <button className="text-gray-500 hover:text-gray-700">
                                    <FontAwesomeIcon icon={faUser} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Friends;
