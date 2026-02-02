import type React from 'react';
import type { User } from '../../types/studyComponents.types';

interface UserSummaryProps {
    data: User;
}

const UserSummary: React.FC<UserSummaryProps> = ({ data }) => {
    return (
        <div className="p-4 bg-white shadow rounded-lg">
            <div className="flex items-center space-x-4 mb-4">
                {data.picture && (
                    <img
                        src={data.picture}
                        alt={data.desc || 'User'}
                        className="w-16 h-16 rounded-full border-2 border-gray-200"
                    />
                )}
                <div>
                    <h2 className="text-xl font-bold">{data.desc || 'No Name'}</h2>
                    <p className="text-gray-500">{data.email}</p>
                </div>
            </div>

            <div className="space-y-2">
                <div>
                    <span className="font-semibold text-gray-700">ID:</span>
                    <span className="ml-2 font-mono text-sm text-gray-600">{data.id}</span>
                </div>
                <div>
                    <span className="font-semibold text-gray-700">Auth0 Subject:</span>
                    <span className="ml-2 font-mono text-sm text-gray-600">{data.auth0_sub}</span>
                </div>
                <div>
                    <span className="font-semibold text-gray-700">Created At:</span>
                    <span className="ml-2 text-gray-600">
                        {data.created_at ? new Date(data.created_at).toLocaleString() : 'N/A'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default UserSummary;
