import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import components
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import PostDetailPage from './components/PostDetailPage';
import AuthComponent from './components/AuthComponent';
import ProfilePage from './components/ProfilePage';
import SubmitPostPage from './components/SubmitPostPage';
import PremiumUpgradePage from './components/PremiumUpgradePage';

// Simple footer component
const Footer = () => (
    <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <h2 className="text-lg font-bold text-blue-600">BountyBoard</h2>
                    <p className="text-sm text-gray-500">
                        Find Reddit posts where users want to pay for solutions.
                    </p>
                </div>
                <div className="flex space-x-6">
                    <a href="#" className="text-gray-500 hover:text-gray-900">
                        About
                    </a>
                    <a href="#" className="text-gray-500 hover:text-gray-900">
                        Terms
                    </a>
                    <a href="#" className="text-gray-500 hover:text-gray-900">
                        Privacy
                    </a>
                    <a href="#" className="text-gray-500 hover:text-gray-900">
                        Contact
                    </a>
                </div>
            </div>
            <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} BountyBoard. All rights reserved.
            </div>
        </div>
    </footer>
);

// Simple about page component
const AboutPage = () => (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">About BountyBoard</h1>
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Mission</h2>
                <p className="text-gray-600 mb-6">
                    BountyBoard is a platform that finds and aggregates Reddit posts where users express a willingness to pay for solutions.
                    We crawl specific subreddits daily to find posts containing key phrases like "I'd pay for..." or "Willing to pay for..."
                    and present them in an easy-to-browse interface.
                </p>

                <h2 className="text-xl font-semibold text-gray-800 mb-4">How It Works</h2>
                <ol className="list-decimal pl-5 text-gray-600 space-y-2 mb-6">
                    <li>Our crawler searches Reddit for posts where someone is willing to pay for a solution.</li>
                    <li>We filter out low-engagement posts to ensure quality.</li>
                    <li>The collected posts are organized in our database with relevant metadata.</li>
                    <li>Users can browse, search, and filter these posts to find opportunities.</li>
                </ol>

                <h2 className="text-xl font-semibold text-gray-800 mb-4">Premium Membership</h2>
                <p className="text-gray-600 mb-4">
                    While basic access to BountyBoard is free, we offer premium memberships with additional benefits:
                </p>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                    <li>Unlimited access to all posts</li>
                    <li>Ad-free browsing experience</li>
                    <li>Advanced search and filtering options</li>
                    <li>Priority notifications for new posts</li>
                </ul>
            </div>
        </div>
    </div>
);

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check if user is already logged in on app load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <Router>
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Homepage />} />
                        <Route path="/post/:id" element={<PostDetailPage />} />
                        <Route
                            path="/login"
                            element={
                                isLoggedIn ?
                                    <Navigate to="/" /> :
                                    <AuthComponent setIsLoggedIn={setIsLoggedIn} />
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                isLoggedIn ?
                                    <Navigate to="/" /> :
                                    <AuthComponent setIsLoggedIn={setIsLoggedIn} />
                            }
                        />
                        <Route
                            path="/profile"
                            element={<ProfilePage isLoggedIn={isLoggedIn} />}
                        />
                        <Route
                            path="/submit"
                            element={<SubmitPostPage isLoggedIn={isLoggedIn} />}
                        />
                        <Route
                            path="/upgrade"
                            element={<PremiumUpgradePage isLoggedIn={isLoggedIn} />}
                        />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;