import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// Mock Stripe Elements for the example
const CardElement = () => {
    return (
        <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
            <p className="text-sm text-gray-500">Credit Card Form (Stripe Elements)</p>
        </div>
    );
};

const PremiumUpgradePage = ({ isLoggedIn }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('monthly');
    const [cardComplete, setCardComplete] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [billingDetails, setBillingDetails] = useState({
        name: '',
        email: '',
        address: {
            line1: '',
            city: '',
            state: '',
            postal_code: '',
        },
    });

    useEffect(() => {
        // In a real implementation, we would initialize Stripe here
        // For demo purposes, we'll just simulate loading
        const initializeStripe = async () => {
            setLoading(true);
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLoading(false);
        };

        if (isLoggedIn) {
            initializeStripe();
        }
    }, [isLoggedIn]);

    // Redirect to login if not authenticated
    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle nested address fields
        if (name.includes('address.')) {
            const addressField = name.split('.')[1];
            setBillingDetails({
                ...billingDetails,
                address: {
                    ...billingDetails.address,
                    [addressField]: value
                }
            });
        } else {
            setBillingDetails({
                ...billingDetails,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!cardComplete) {
            setError('Please complete your card details');
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            // In a real implementation, we would use Stripe.js to create a payment method
            // and send it to our backend

            // Simulate API call with random success/failure
            await new Promise(resolve => setTimeout(resolve, 2000));

            // For demo purposes, we'll occasionally simulate an error
            if (Math.random() < 0.2) {
                throw new Error('Your card was declined.');
            }

            setSuccess(true);
            setProcessing(false);

            // Normally we would update the user's membership status in the app state here
        } catch (err) {
            setError(err.message);
            setProcessing(false);
        }
    };

    const plans = {
        monthly: {
            price: '$9.99',
            period: 'month',
            savings: null,
        },
        yearly: {
            price: '$99.99',
            period: 'year',
            savings: 'Save 17%',
        },
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 bg-green-50 border-b border-green-100">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-medium text-green-800">Payment Successful!</h3>
                                <div className="mt-2 text-sm text-green-700">
                                    <p>Your premium membership is now active. Enjoy unlimited access to all posts and ad-free browsing!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Membership Details</h3>
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Plan</dt>
                                <dd className="mt-1 text-sm text-gray-900">Premium {selectedPlan === 'monthly' ? 'Monthly' : 'Annual'}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Price</dt>
                                <dd className="mt-1 text-sm text-gray-900">{plans[selectedPlan].price} / {plans[selectedPlan].period}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Billing Date</dt>
                                <dd className="mt-1 text-sm text-gray-900">{new Date().toLocaleDateString()}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Next Billing Date</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {(() => {
                                        const nextDate = new Date();
                                        if (selectedPlan === 'monthly') {
                                            nextDate.setMonth(nextDate.getMonth() + 1);
                                        } else {
                                            nextDate.setFullYear(nextDate.getFullYear() + 1);
                                        }
                                        return nextDate.toLocaleDateString();
                                    })()}
                                </dd>
                            </div>
                        </dl>
                        <div className="mt-6">
                            <a
                                href="/"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Return to Homepage
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Upgrade to Premium</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-2">Free</h2>
                        <p className="text-gray-500 mb-4">Current Plan</p>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm text-gray-600">Limited access to posts</span>
                            </div>
                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm text-gray-600">Basic search and filtering</span>
                            </div>
                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm text-gray-600">Ads displayed</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 rounded-lg shadow-md overflow-hidden border-2 border-blue-500">
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-blue-900 mb-2">Premium</h2>
                        <div className="flex items-center mb-4">
                            <div className="text-blue-900 text-2xl font-bold">{plans[selectedPlan].price}</div>
                            <span className="text-blue-700 ml-1">/ {plans[selectedPlan].period}</span>
                            {plans[selectedPlan].savings && (
                                <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                  {plans[selectedPlan].savings}
                </span>
                            )}
                        </div>
                        <div className="flex items-center bg-white rounded-md p-1 mb-4">
                            <button
                                type="button"
                                className={`flex-1 py-1 px-3 rounded-md text-sm font-medium ${
                                    selectedPlan === 'monthly'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:text-gray-900'
                                }`}
                                onClick={() => setSelectedPlan('monthly')}
                            >
                                Monthly
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-1 px-3 rounded-md text-sm font-medium ${
                                    selectedPlan === 'yearly'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:text-gray-900'
                                }`}
                                onClick={() => setSelectedPlan('yearly')}
                            >
                                Yearly
                            </button>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm text-blue-800">Unlimited access to all posts</span>
                            </div>
                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm text-blue-800">Advanced search and filtering options</span>
                            </div>
                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm text-blue-800">Ad-free browsing experience</span>
                            </div>
                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm text-blue-800">Priority notifications for new posts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Name on card
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={billingDetails.name}
                                            onChange={handleChange}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email address
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={billingDetails.email}
                                            onChange={handleChange}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Card details
                                    </label>
                                    <div className="mt-1">
                                        <CardElement />
                                        <div className="mt-2">
                                            <button
                                                type="button"
                                                onClick={() => setCardComplete(true)}
                                                className="text-xs text-blue-600"
                                            >
                                                (Demo: Click to simulate card complete)
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="address.line1" className="block text-sm font-medium text-gray-700">
                                        Address
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            id="address.line1"
                                            name="address.line1"
                                            value={billingDetails.address.line1}
                                            onChange={handleChange}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                                        City
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            id="address.city"
                                            name="address.city"
                                            value={billingDetails.address.city}
                                            onChange={handleChange}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
                                        State / Province
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            id="address.state"
                                            name="address.state"
                                            value={billingDetails.address.state}
                                            onChange={handleChange}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="address.postal_code" className="block text-sm font-medium text-gray-700">
                                        Postal code
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            id="address.postal_code"
                                            name="address.postal_code"
                                            value={billingDetails.address.postal_code}
                                            onChange={handleChange}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    required
                                />
                                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and
                                    <a href="#" className="text-blue-600 hover:underline"> Privacy Policy</a>
                                </label>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        `Subscribe - ${plans[selectedPlan].price}/${plans[selectedPlan].period}`
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900">Questions?</h3>
                <div className="mt-2 text-sm text-gray-500">
                    <p>If you have any questions about our premium membership, please contact our support team at <a href="mailto:support@bountyboard.com" className="text-blue-600 hover:underline">support@bountyboard.com</a>.</p>
                </div>
            </div>
        </div>
    );
};

export default PremiumUpgradePage;