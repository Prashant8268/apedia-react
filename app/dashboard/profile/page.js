"use client"
import { useEffect, useState } from 'react';
import Posts from '../posts/page';
// Mock data fetching function for initial data
const fetchProfileData = async () => {
    return {
        user: {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            avatar: '/path-to-avatar.jpg', // Replace with actual image path
        },
        profile_user: {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
        },
    };
};

const Profile = () => {
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const data = await fetchProfileData();
            setProfileData(data);
        };
        getData();
    }, []);

    if (!profileData) {
        return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
    }

    const { user, profile_user } = profileData;

    return (
        <div className="bg-gray-100  min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="mx-auto bg-white text-black p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full mb-4 border-4 border-black flex justify-center items-center">
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-28 h-28 rounded-full"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-blue-500">{user.name}</h1>
                    <p className="text-gray-700">{user.email}</p>

                    {user.id === profile_user.id ? (
                        <>
                            <div className="w-full mt-6">
                                <h3 className="text-xl mb-4">Update Profile</h3>
                                <form action={`/update/${profile_user.id}`} enctype="multipart/form-data" method="POST">
                                    <input
                                        type="text"
                                        name="name"
                                        value={profile_user.name}
                                        required
                                        placeholder="Your Name"
                                        className="w-full p-2 mb-2 border border-gray-300 rounded"
                                        onChange={(e) => setProfileData(prevState => ({
                                            ...prevState,
                                            profile_user: {
                                                ...prevState.profile_user,
                                                name: e.target.value
                                            }
                                        }))}
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        value={profile_user.email}
                                        required
                                        placeholder="Your Email"
                                        className="w-full p-2 mb-2 border border-gray-300 rounded"
                                        onChange={(e) => setProfileData(prevState => ({
                                            ...prevState,
                                            profile_user: {
                                                ...prevState.profile_user,
                                                email: e.target.value
                                            }
                                        }))}
                                    />
                                    <input
                                        type="file"
                                        name="avatar"
                                        placeholder="Profile Picture"
                                        className="w-full p-2 mb-2 border border-gray-300 rounded"
                                    />
                                    <input
                                        type="submit"
                                        value="Update"
                                        className="btn-primary mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                                    />
                                </form>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="mt-4">Name: {profile_user.name}</p>
                            <p>Email: {profile_user.email}</p>
                        </>
                    )}
                </div>
            </div>
            <Posts />
        </div>
    );
};

export default Profile;
