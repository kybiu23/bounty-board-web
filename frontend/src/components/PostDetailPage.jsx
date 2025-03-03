import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const PostDetailPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                setLoading(true);
                // Fetch post data
                const postResponse = await fetch(`/api/posts/${id}`);
                if (!postResponse.ok) {
                    throw new Error('Failed to fetch post details');
                }
                const postData = await postResponse.json();
                setPost(postData);

                // Fetch comments for the post
                const commentsResponse = await fetch(`/api/posts/${id}/comments`);
                if (!commentsResponse.ok) {
                    throw new Error('Failed to fetch comments');
                }
                const commentsData = await commentsResponse.json();
                setComments(commentsData);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPostDetails();
    }, [id]);

    // Function to format date in a readable way
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Recursive function to render comment tree
    const renderComments = (commentsArray, parentId = null, depth = 0) => {
        const filteredComments = commentsArray.filter(
            comment => comment.parent_comment_id === parentId
        );

        if (filteredComments.length === 0) {
            return null;
        }

        return (
            <div className={`${depth > 0 ? 'pl-6 border-l border-gray-200' : ''}`}>
                {filteredComments.map(comment => (
                    <div key={comment.id} className="mb-4">
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex justify-between items-center mb-2">
                                <div className="font-medium text-gray-800">{comment.author}</div>
                                <div className="text-xs text-gray-500">
                                    {formatDate(comment.submission_date)}
                                </div>
                            </div>
                            <div className="text-gray-700 mb-2">{comment.body}</div>
                            <div className="text-xs text-gray-500">
                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                  </svg>
                    {comment.upvotes}
                </span>
                            </div>
                        </div>
                        {renderComments(commentsArray, comment.id, depth + 1)}
                    </div>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-red-100 p-4 rounded-md mb-4">
                    <p className="text-red-700">{error || 'Post not found'}</p>
                </div>
                <Link to="/" className="text-blue-600 hover:underline">
                    ← Back to posts
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Link to="/" className="inline-flex items-center text-blue-600 hover:underline mb-6">
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
                Back to posts
            </Link>

            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">{post.title}</h1>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              r/{post.subreddit_name}
            </span>
                    </div>

                    <div className="mb-6">
                        <p className="text-gray-700 whitespace-pre-line">{post.body}</p>
                    </div>

                    <div className="flex flex-wrap justify-between items-center text-sm text-gray-500 border-t border-gray-200 pt-4">
                        <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                </svg>
                  {post.upvotes} upvotes
              </span>
                            <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path>
                </svg>
                                {post.comments_count} comments
              </span>
                        </div>
                        <div className="mt-2 sm:mt-0">
                            <div className="flex items-center">
                                <span className="mr-2">Posted by u/{post.author}</span>
                                <span>{formatDate(post.submission_date)}</span>
                            </div>
                            <a
                                href={post.post_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline inline-flex items-center mt-1"
                            >
                                View on Reddit
                                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 100-2H5z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Comments ({comments.length})
            </h2>

            {comments.length > 0 ? (
                renderComments(comments)
            ) : (
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                    <p className="text-gray-500">No comments yet.</p>
                </div>
            )}
        </div>
    );
};

export default PostDetailPage;