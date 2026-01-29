import React from 'react';
import LoginButton from '../components/buttons/auth/LoginButton';

export const Landing: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center text-gray-200">
                <div className="bg-gray-700 border border-gray-400 p-5 rounded-lg">
                    <h1 className="text-2xl">RSSA Dashboard</h1>
                    <p>This is the administrative console for the RSSA studies.</p>
                </div>
                <div className="mt-6 bg-gray-700 border border-gray-300 p-5 rounded-lg">
                    <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
                    <p className="text-gray-200 mb-8">Please log in to access the dashboard.</p>
                    <div className="w-40 mx-auto">
                        <LoginButton />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
