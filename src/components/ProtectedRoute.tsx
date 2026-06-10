import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppAuth } from '../auth/AuthContext';

const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAppAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold">Loading...</h2>
                </div>
            </div>
        );
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;
