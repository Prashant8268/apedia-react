import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faTrash,
  faReply,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
const PostActions = ({
  post,
  handleLikePost,
  isPostLiked,
  openComments,
  setOpenComments,
  comments,
  handleAddComment,
  newComment,
  setNewComment,
  handleDeleteComment, // Assume this prop is passed for deleting comments
}) => {
  const commentsToShow = 5; // Maximum number of comments to show
  const [visibleComments, setVisibleComments] = React.useState(commentsToShow);

  // Function to handle "View More" button
  const handleViewMore = () => {
    setVisibleComments((prev) => prev + commentsToShow);
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLikePost}
            className={`flex items-center text-gray-500 ${
              isPostLiked ? "text-red-500" : "text-black"
            } transition duration-200`}
          >
            <FontAwesomeIcon icon={faHeart} className="mr-1" />
            {post.likes.length}
          </button>
          <button
            onClick={() => setOpenComments((prev) => !prev)}
            className={`flex items-center text-gray-500 ${
              openComments ? "text-blue-500" : "text-black"
            } transition duration-200`}
          >
            <FontAwesomeIcon icon={faComment} className="mr-1" />
            {comments.length} Comments
          </button>
        </div>
      </div>

      {openComments && (
        <div className="bg-gray-50 rounded-lg p-4 mt-4 max-w-xl shadow-md">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {comments.length === 0 ? (
              <p className="text-gray-600">No comments to show.</p>
            ) : (
              comments.slice(0, visibleComments).map((comment) => (
                <div
                  key={comment._id}
                  className="flex items-start justify-between space-x-2 mb-4 border-b border-gray-200 pb-2"
                >
                  <div className="flex-grow">
                    <p className="text-sm font-semibold">{comment.user.name}</p>
                    <p className="text-gray-700 mt-1">{comment.content}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-gray-500 hover:text-red-500"
                      title="Delete Comment"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button
                      className="text-gray-500 hover:text-blue-500"
                      title="Reply"
                    >
                      <FontAwesomeIcon icon={faReply} />
                    </button>
                    <button
                      className="text-gray-500 hover:text-red-500"
                      title="Like Comment"
                    >
                      <FontAwesomeIcon icon={faHeart} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {comments.length > visibleComments && (
            <button
              onClick={handleViewMore}
              className="text-blue-500 hover:underline mt-2"
            >
              View More
            </button>
          )}

          <form onSubmit={handleAddComment} className="mt-4 flex items-center">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 transition duration-200"
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
            >
              Comment
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostActions;
