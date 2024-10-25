const PostContent = ({ post }) => {
  return (
    <>
      {/* Render post content */}
      <p className="text-gray-800 mb-2">{post.content}</p>

      {/* Render post image if it exists */}
      {post.photoUrl && (
        <img
          src={post.photoUrl}
          alt="Post"
          className="w-full h-auto mb-4 rounded-lg object-cover shadow-md"
        />
      )}
    </>
  );
};

export default PostContent;
