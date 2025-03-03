import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

const SubmitPostPage = ({ isLoggedIn }) => {
    const [formData, setFormData] = useState({
        title: '',
        body: '',
        subreddit: '',
        author: '',
        post_url: '',
    });
    const [subreddits, setSubreddits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    // Fetch available subreddits
    useEffect(() => {
        const fetchSubreddits = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/subreddits');
                if (!response.ok) {
                    throw new Error('Failed to fetch subreddits');
                }

                const data = await response.json();
                setSubreddits(data);
                setLoading(false);
            } catch (err) {
                setError('Error loading subreddits. Please try again later.');
                setLoading(false);
            }
        };

        fetchSubreddits();
    }, []);

    // Redirect to login if not authenticated
    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            setError('Post title is required');
            return false;
        }

        if (!formData.body.trim()) {
            setError('Post body is required');
            return false;
        }

        if (!formData.subreddit) {
            setError('Please select a subreddit');
            return false;
        }

        if (!formData.author.trim()) {
            setError('Author name is required');
            return false;
        }

        // Simple URL validation
        if (formData.post_url && !isValidURL(formData.post_url)) {
            setError('Please enter a valid URL');
            return false;
        }

        return true;
    };

    const isValidURL = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setError(null);
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/posts/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    manually_added: true
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to submit post');
            }

            setSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Submit a Post</h1>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {success && (
                <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-700">Post submitted successfully! Redirecting...</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Post Title *
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    placeholder="Enter a descriptive title"
                                    required
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Make it clear what the person is willing to pay for
                            </p>
                        </div>

                        <div>
                            <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                                Post Body *
                            </label>
                            <div className="mt-1">
                <textarea
                    id="body"
                    name="body"
                    rows={6}
                    value={formData.body}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="Enter the full content of the post"
                    required
                ></textarea>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Include all relevant details from the original post
                            </p>
                        </div>

                        <div>
                            <label htmlFor="subreddit" className="block text-sm font-medium text-gray-700">
                                Subreddit *
                            </label>
                            <div className="mt-1">
                                <select
                                    id="subreddit"
                                    name="subreddit"
                                    value={formData.subreddit}
                                    onChange={handleChange}
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="">Select a subreddit</option>
                                    {loading ? (
                                        <option disabled>Loading subreddits...</option>
                                    ) : (
                                        subreddits.map(subreddit => (
                                            <option key={subreddit.id} value={subreddit.name}>
                                                r/{subreddit.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                                Original Author *
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="author"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    placeholder="Reddit username of the original poster"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="post_url" className="block text-sm font-medium text-gray-700">
                                Original Post URL
                            </label>
                            <div className="mt-1">
                                <input
                                    type="url"
                                    id="post_url"
                                    name="post_url"
                                    value={formData.post_url}
                                    onChange={handleChange}
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    placeholder="https://reddit.com/r/subreddit/comments/..."
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Provide a link to the original Reddit post if available
                            </p>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                            >
                                {submitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Post'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="mt-8 bg-blue-50 rounded-lg p-6">
                <h2 className="text-lg font-medium text-blue-800 mb-2">Submission Guidelines</h2>
                <ul className="text-sm text-blue-700 space-y-2">
                    <li className="flex items-start">
                        <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Only submit posts where someone explicitly mentions they're willing to pay for a solution
                    </li>
                    <li className="flex items-start">
                        <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Include the original post title, body, and author information
                    </li>
                    <li className="flex items-start">
                        <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Provide a link to the original post if available
                    </li>
                    <li className="flex items-start">
                        <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Posts are manually reviewed before being listed publicly
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SubmitPostPage;