"use client"
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faTrash, faEllipsisV, faLink } from '@fortawesome/free-solid-svg-icons';

const Posts = () => {
    // Dummy data for posts
    const dummyPosts = [
        {
            id: 1,
            username: 'JohnDoe',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            likes: 10,
            comments: [
                { id: 1, username: 'Alice', text: 'First comment', likes: 2 },
                { id: 2, username: 'Bob', text: 'Second comment', likes: 1 },
                { id: 3, username: 'Charlie', text: 'Third comment', likes: 3 },
                { id: 4, username: 'Dave', text: 'Fourth comment', likes: 2 },
                { id: 5, username: 'Alice', text: 'First comment', likes: 2 },
                { id: 6, username: 'Bob', text: 'Second comment', likes: 1 },
                { id: 7, username: 'Charlie', text: 'Third comment', likes: 3 },
                { id: 8, username: 'Dave', text: 'Fourth comment', likes: 2 },
            ]
        },
        {
            id: 2,
            username: 'JaneSmith',
            content: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
            likes: 20,
            comments: [
                { id: 9, username: 'Eve', text: 'Fifth comment', likes: 1 },
                { id: 10, username: 'Frank', text: 'Sixth comment', likes: 0 },
                { id: 11, username: 'Grace', text: 'Seventh comment', likes: 2 },
            ]
        }
    ];

    // State to manage liked posts
    const [likedPosts, setLikedPosts] = useState([]);
    // State to manage open comments
    const [openComments, setOpenComments] = useState({});
    // State to manage liked comments
    const [likedComments, setLikedComments] = useState([]);
    // State to manage number of comments to show initially
    const [commentsToShow, setCommentsToShow] = useState({});
    // State to manage open post menu
    const [openPostMenu, setOpenPostMenu] = useState(null);

    // Function to handle like button click for posts
    const handleLike = (postId) => {
        if (likedPosts.includes(postId)) {
            setLikedPosts(likedPosts.filter(id => id !== postId));
        } else {
            setLikedPosts([...likedPosts, postId]);
        }
    };

    // Function to handle comment button click
    const handleComment = (postId) => {
        setOpenComments({ ...openComments, [postId]: !openComments[postId] });
        setCommentsToShow({ ...commentsToShow, [postId]: 2 });
    };

    // Function to handle like button click for comments
    const handleLikeComment = (commentId) => {
        if (likedComments.includes(commentId)) {
            setLikedComments(likedComments.filter(id => id !== commentId));
        } else {
            setLikedComments([...likedComments, commentId]);
        }
    };

    // Function to handle delete button click for comments
    const handleDeleteComment = (postId, commentId) => {
        const postIndex = dummyPosts.findIndex(post => post.id === postId);
        const updatedComments = dummyPosts[postIndex].comments.filter(comment => comment.id !== commentId);
        dummyPosts[postIndex].comments = updatedComments;
        setOpenComments({ ...openComments });
    };

    // Function to handle "See More" button click
    const handleSeeMore = (postId) => {
        setCommentsToShow({ ...commentsToShow, [postId]: commentsToShow[postId] + 2 });
    };

    // Function to handle post menu button click
    const handlePostMenu = (postId) => {
        setOpenPostMenu(openPostMenu === postId ? null : postId);
    };

    // Function to handle post delete
    const handleDeletePost = (postId) => {
        const updatedPosts = dummyPosts.filter(post => post.id !== postId);
        // Assuming dummyPosts is state, you'd set it here
        // setDummyPosts(updatedPosts);
        console.log('Post deleted:', postId);
        setOpenPostMenu(null);
    };

    // Function to handle copy link
    const handleCopyLink = (postId) => {
        const postLink = `https://example.com/post/${postId}`;
        navigator.clipboard.writeText(postLink);
        console.log('Post link copied:', postLink);
        setOpenPostMenu(null);
    };

    return (
        <div className="bg-gray-100 p-6 rounded-lg">
            <h1 className="text-3xl font-bold mb-6">Posts</h1>
            {dummyPosts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow-md p-6 mb-6 relative">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-lg font-semibold">{post.username}</p>
                        <button onClick={() => handlePostMenu(post.id)} className="text-gray-500 hover:text-gray-800">
                            <FontAwesomeIcon icon={faEllipsisV} />
                        </button>
                        {openPostMenu === post.id && (
                            <div className="absolute right-0 top-10 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                                <button onClick={() => handleDeletePost(post.id)} className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                                    Delete
                                </button>
                                <button onClick={() => handleCopyLink(post.id)} className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                                    Copy Link
                                </button>
                            </div>
                        )}
                    </div>
                    <p className="text-gray-800 mb-4">{post.content}</p>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <button onClick={() => handleLike(post.id)} className={`text-gray-500 ${likedPosts.includes(post.id) ? 'text-red-500' : 'text-black'}`}>
                                <FontAwesomeIcon icon={faHeart} />
                                {post.likes}
                            </button>
                            <button onClick={() => handleComment(post.id)} className="text-gray-500 hover:text-blue-500">
                                <FontAwesomeIcon icon={faComment} /> {post.comments.length} Comments
                            </button>
                        </div>
                    </div>
                    {openComments[post.id] && (
                        <div className="bg-gray-100 rounded-lg p-4 mt-4 max-w-xl max-h-60 overflow-y-auto custom-scrollbar">
                            {post.comments.slice(0, commentsToShow[post.id] || 2).map(comment => (
                                <div key={comment.id} className="flex items-start space-x-2 mb-2 last:mb-0">
                                    <div className="flex-grow">
                                        <p className="text-sm font-semibold">{comment.username}</p>
                                        <p className="text-gray-600">{comment.text}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => handleLikeComment(comment.id)} className={`text-gray-500 ${likedComments.includes(comment.id) ? 'text-red-500' : 'text-black'}`}>
                                            <FontAwesomeIcon icon={faHeart} /> {comment.likes}
                                        </button>
                                        <button onClick={() => handleDeleteComment(post.id, comment.id)} className="text-gray-500 hover:text-red-500">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {(commentsToShow[post.id] || 2) < post.comments.length && (
                                <button onClick={() => handleSeeMore(post.id)} className="text-blue-500 hover:underline mt-2">
                                    See More
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Posts;