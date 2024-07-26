"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPaperPlane, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const Messages = () => {
    const router = useRouter();

    // Dummy data for conversations and messages
    const [conversations, setConversations] = useState([
        { id: 1, username: 'Alice', profilePic: 'https://via.placeholder.com/50' },
        { id: 2, username: 'Bob', profilePic: 'https://via.placeholder.com/50' },
        { id: 3, username: 'Charlie', profilePic: 'https://via.placeholder.com/50' },
    ]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);

    // Function to handle conversation selection
    const handleConversationSelect = (conversationId) => {
        const selectedConv = conversations.find(conv => conv.id === conversationId);
        setSelectedConversation(selectedConv);
        // Fetch messages for the selected conversation from API or dummy data
        const dummyMessages = [
            { id: 1, text: 'Hello!', sender: 'Alice', timestamp: new Date().toLocaleString() },
            { id: 2, text: 'Hi, how are you?', sender: 'Bob', timestamp: new Date().toLocaleString() },
            { id: 3, text: 'I\'m good, thanks!', sender: 'Alice', timestamp: new Date().toLocaleString() },
            { id: 4, text: 'Great!', sender: 'Bob', timestamp: new Date().toLocaleString() },
        ];
        setMessages(dummyMessages);
    };

    // Function to handle user profile click
    const handleProfileClick = (username) => {
        router.push(`/profile/${username}`);
    };

    // Function to send a message
    const sendMessage = () => {
        // Implement logic to send the message
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="bg-gray-100 p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Conversations</h2>
            </div>
            <div className="flex-1 flex">
                <div className="w-full md:w-1/4 p-4 bg-white border-r border-gray-200">
                    <div className="md:hidden">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Conversations</h3>
                            <button className="text-gray-500 hover:text-gray-800">
                                <FontAwesomeIcon icon={faChevronDown} />
                            </button>
                        </div>
                        <div className="overflow-hidden transition-max-height duration-500 ease-in-out">
                            {conversations.map(conversation => (
                                <div
                                    key={conversation.id}
                                    className={`flex items-center p-3 cursor-pointer ${selectedConversation && selectedConversation.id === conversation.id ? 'bg-gray-200' : ''}`}
                                    onClick={() => handleConversationSelect(conversation.id)}
                                >
                                    <img
                                        src={conversation.profilePic}
                                        alt={conversation.username}
                                        className="w-10 h-10 rounded-full border border-gray-300 mr-3"
                                        onClick={() => handleProfileClick(conversation.username)}
                                    />
                                    <p
                                        className="text-lg font-semibold"
                                        onClick={() => handleProfileClick(conversation.username)}
                                    >
                                        {conversation.username}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="hidden md:block">
                        {conversations.map(conversation => (
                            <div
                                key={conversation.id}
                                className={`flex items-center p-3 cursor-pointer ${selectedConversation && selectedConversation.id === conversation.id ? 'bg-gray-200' : ''}`}
                                onClick={() => handleConversationSelect(conversation.id)}
                            >
                                <img
                                    src={conversation.profilePic}
                                    alt={conversation.username}
                                    className="w-10 h-10 rounded-full border border-gray-300 mr-3"
                                    onClick={() => handleProfileClick(conversation.username)}
                                />
                                <p
                                    className="text-lg font-semibold"
                                    onClick={() => handleProfileClick(conversation.username)}
                                >
                                    {conversation.username}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full md:w-3/4 p-4 bg-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                        {selectedConversation ? (
                            <div className="flex items-center">
                                <img
                                    src={selectedConversation.profilePic}
                                    alt={selectedConversation.username}
                                    className="w-10 h-10 rounded-full border border-gray-300 mr-3"
                                    onClick={() => handleProfileClick(selectedConversation.username)}
                                />
                                <p className="text-lg font-semibold">{selectedConversation.username}</p>
                            </div>
                        ) : (
                            <p className="text-xl text-gray-800">Select a conversation to start chatting</p>
                        )}
                        <button className="text-gray-500 hover:text-gray-800">
                            <FontAwesomeIcon icon={faUser} />
                        </button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        {selectedConversation && (
                            messages.map(message => (
                                <div key={message.id} className={`flex ${message.sender === 'Bob' ? 'justify-end' : 'justify-start'} mb-4`}>
                                    <div className={`bg-white p-3 rounded-lg ${message.sender === 'Bob' ? 'ml-auto' : 'mr-auto'}`}>
                                        <p className="text-gray-800">{message.text}</p>
                                        <p className="text-xs text-gray-600">{message.timestamp}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {selectedConversation && (
                        <div className="p-4 bg-white">
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    placeholder="Type your message"
                                    className="flex-1 border border-gray-300 rounded-l-lg py-2 px-3 focus:outline-none focus:ring focus:border-blue-400"
                                />
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-r-lg ml-2 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-400"
                                    onClick={sendMessage}
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
