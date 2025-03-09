import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubreddit, setSelectedSubreddit] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [subreddits, setSubreddits] = useState([]);
    const navigate = useNavigate();

    // Fetch posts from backend
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                // Replace with your actual API endpoint
                const response = await fetch(
                    `${process.env.REACT_APP_API_BASE_URL}/api/posts?page=${page}&search=${searchTerm}&subreddit=${selectedSubreddit}&sort=${sortBy}`
                );

                if (!response.ok) {
                    if (response.status === 404) {
                        // If page not found, set posts to empty array and adjust total pages
                        setPosts([]);
                        // Go back to the last valid page
                        setPage(Math.max(1, page - 1));
                        setError("No more posts available");
                    } else {
                        throw new Error('Failed to fetch posts');
                    }
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                setPosts(data.results);
                setTotalPages(Math.ceil(data.count / 10)); // Assuming 10 posts per page
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPosts();
    }, [page, searchTerm, selectedSubreddit, sortBy]);

    // Fetch subreddits for filter dropdown
    useEffect(() => {
        const fetchSubreddits = async () => {
            try {
                const response = await fetch( `${process.env.REACT_APP_API_BASE_URL}/api/subreddits`);
                if (!response.ok) {
                    throw new Error('Failed to fetch subreddits');
                }

                const data = await response.json();
                // Make sure data is an array before setting it
                if (Array.isArray(data)) {
                    setSubreddits(data);
                } else if (data.results && Array.isArray(data.results)) {
                    // If the API returns paginated data with a 'results' field
                    setSubreddits(data.results);
                } else {
                    console.error('Subreddit data is not an array:', data);
                    setSubreddits([]);
                }
            } catch (err) {
                console.error('Error fetching subreddits:', err);
                setSubreddits([]);
            }
        };

        fetchSubreddits();
    }, []);

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1); // Reset to first page on new search
    };

    // Function to format date in a readable way
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Function to truncate text
    const truncateText = (text, maxLength = 150) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">BountyBoard</h1>
            <p className="text-gray-600 mb-8">
                Discover Reddit posts where users are willing to pay for solutions
            </p>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow">
                        <input
                            type="text"
                            placeholder="Search by keyword..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="md:w-1/4">
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedSubreddit}
                            onChange={(e) => setSelectedSubreddit(e.target.value)}
                        >
                            <option value="">All Subreddits</option>
                            {Array.isArray(subreddits) && subreddits.map((subreddit) => (
                                <option key={subreddit.id} value={subreddit.id}>
                                    r/{subreddit.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:w-1/4">
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="date">Latest</option>
                            <option value="upvotes">Most Upvoted</option>
                            <option value="comments">Most Commented</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Posts Section */}
            {error ? (
                <div className="bg-red-100 p-4 rounded-md mb-4">
                    <p className="text-red-700">{error}</p>
                </div>
            ) : loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-6">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => handlePostClick(post.id)}
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h2 className="text-xl font-semibold text-gray-800">{post.title}</h2>
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                r/{post.subreddit_name}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-4">{truncateText(post.body)}</p>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                                                    </svg>
                                                    {post.upvotes}
                                                </span>
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path>
                                                    </svg>
                                                    {post.comments_count}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                <span>{formatDate(post.submission_date)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                <p className="text-gray-500 text-lg">No posts found matching your criteria. Try adjusting your search or filters.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            <nav className="flex items-center space-x-2">
                                <button
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                    className={`px-3 py-1 rounded-md ${
                                        page === 1
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Previous
                                </button>

                                {/* Show limited page numbers with ellipsis for large numbers */}
                                {[...Array(totalPages).keys()].map((num) => {
                                    const pageNum = num + 1;
                                    // Only show first page, last page, current page and pages around current page
                                    if (
                                        pageNum === 1 ||
                                        pageNum === totalPages ||
                                        (pageNum >= page - 2 && pageNum <= page + 2)
                                    ) {
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPage(pageNum)}
                                                className={`px-3 py-1 rounded-md ${
                                                    page === pageNum
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    } else if (
                                        (pageNum === page - 3 && pageNum > 1) ||
                                        (pageNum === page + 3 && pageNum < totalPages)
                                    ) {
                                        // Add ellipsis
                                        return <span key={pageNum} className="px-2">...</span>;
                                    }
                                    return null;
                                })}

                                <button
                                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                                    disabled={page === totalPages}
                                    className={`px-3 py-1 rounded-md ${
                                        page === totalPages
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Homepage;