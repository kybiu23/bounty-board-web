import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';

const ProfilePage = ({ isLoggedIn }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Redirect if not logged in
        if (!isLoggedIn) {
            return;
        }

        const fetchUserData = async () => {
            try {
                setLoading(true);
                // Get token from localStorage
                const token = localStorage.getItem('token');

                // Fetch user profile data
                const profileResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!profileResponse.ok) {
                    throw new Error('Failed to fetch user profile');
                }

                const profileData = await profileResponse.json();
                setUser(profileData);

                // Fetch user notifications
                const notificationsResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/notifications`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!notificationsResponse.ok) {
                    throw new Error('Failed to fetch notifications');
                }

                const notificationsData = await notificationsResponse.json();
                setNotifications(notificationsData);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [isLoggedIn]);

    // Redirect to login if not authenticated
    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    // Format date for better readability
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Mark notification as read
    const markAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to update notification');
            }

            // Update notification read status in state
            setNotifications(notifications.map(notification =>
                notification.id === notificationId
                    ? { ...notification, read_status: true }
                    : notification
            ));
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
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

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-red-100 p-4 rounded-md mb-4">
                    <p className="text-red-700">{error}</p>
                </div>
                <Link to="/" className="text-blue-600 hover:underline">
                    ← Back to home
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h1>

            {/* User Information Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="p-6">
                    <div className="flex items-center mb-6">
                        <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl mr-4">
                            {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800">
                                {user?.first_name} {user?.last_name || ''}
                            </h2>
                            <p className="text-gray-600">{user?.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Account Information</h3>
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Member since</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{formatDate(user?.created_at)}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Membership</dt>
                                    <dd className="mt-1 text-sm">
                                        {user?.membership_status === 'Premium' ? (
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        Premium
                      </span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        Free
                      </span>
                                        )}
                                    </dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Login method</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {user?.oauth_provider || 'Email/Password'}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {user?.membership_status === 'Free' && (
                            <div className="flex flex-col justify-center">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">Upgrade to Premium</h3>
                                    <p className="text-gray-600 mb-4">
                                        Get unlimited access to posts and ad-free browsing with a premium membership.
                                    </p>
                                    <Link
                                        to="/upgrade"
                                        className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Upgrade Now
                                    </Link>
                                </div>
                            </div>
                        )}

                        {user?.membership_status === 'Premium' && (
                            <div className="flex flex-col justify-center">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-blue-800 mb-2">Premium Member</h3>
                                    <p className="text-blue-600 mb-4">
                                        Thank you for being a premium member! You have unlimited access to all posts and ad-free browsing.
                                    </p>
                                    <Link
                                        to="/settings/subscription"
                                        className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Manage Subscription
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Notifications Section */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Notifications</h2>
            {notifications.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {notifications.map(notification => (
                            <li key={notification.id} className={`p-4 ${!notification.read_status ? 'bg-blue-50' : ''}`}>
                                <div className="flex justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-1">
                                            {notification.type === 'New Post' && (
                                                <svg className="h-5 w-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            {notification.type === 'Account Update' && (
                                                <svg className="h-5 w-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            {notification.type === 'Membership Change' && (
                                                <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            <span className="font-medium text-gray-900">{notification.type}</span>
                                        </div>
                                        <p className="text-gray-600">{notification.content}</p>
                                        <p className="text-xs text-gray-500 mt-1">{formatDate(notification.created_at)}</p>
                                    </div>
                                    {!notification.read_status && (
                                        <button
                                            onClick={() => markAsRead(notification.id)}
                                            className="text-xs text-blue-600 hover:text-blue-800"
                                        >
                                            Mark as read
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-500">You have no notifications at this time.</p>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;