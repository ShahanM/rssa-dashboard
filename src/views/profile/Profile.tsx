import { useAuth0 } from '@auth0/auth0-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Highlight from '../../components/Highlight';
import { useApi } from '../../hooks/useApi';
import { usePermissions } from '../../hooks/usePermissions';

type DbUser = {
    id: string;
    auth0_sub: string;
    email: string;
    desc: string;
    picture: string;
};

const Profile = () => {
    const { user: auth0User } = useAuth0();
    const navigate = useNavigate();
    const { api } = useApi();
    const { hasPermission } = usePermissions();
    const showDebug = hasPermission('admin:all');

    const { data: dbUser, isLoading } = useQuery({
        queryKey: ['users', 'me'],
        queryFn: async () => {
            return await api.get<DbUser>('users/me');
        },
    });

    if (auth0User === undefined || auth0User === null) {
        navigate('/');
        return <>Loading</>;
    }

    if (isLoading) {
        return <div className="p-8 text-center text-gray-400">Syncing profile...</div>;
    }

    const displayUser: any = dbUser || {
        ...auth0User,
        desc: auth0User && 'name' in auth0User ? auth0User.name : '',
    };

    return (
        <div className="container mx-auto mb-5 p-4">
            <h1 className="text-3xl font-bold mb-6 text-white">Your Profile</h1>
            <div className="flex flex-col md:flex-row items-center mb-5 text-center md:text-left bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="md:w-2/12">
                    <img
                        src={displayUser.picture || auth0User.picture}
                        alt="Profile picture."
                        className="rounded-full w-32 h-32 mb-3 md:mb-0 border-4 border-purple-500"
                    />
                </div>
                <div className="md:w-full md:ml-6">
                    <h2 className="text-2xl font-bold text-white mb-1">
                        {displayUser.desc || displayUser.name || auth0User.name}
                    </h2>
                    <p className="text-lg text-gray-400 mb-2">{displayUser.email || auth0User.email}</p>
                    <div className="flex flex-col gap-1 text-sm text-gray-400">
                        {showDebug && (
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">ID:</span>
                                <span className="font-mono bg-gray-900 px-2 py-0.5 rounded text-xs select-all">
                                    {dbUser?.id || 'Syncing...'}
                                </span>
                            </div>
                        )}
                        <div>
                            <span className="font-semibold">Email Verified:</span>{' '}
                            {auth0User.email_verified ? 'Yes' : 'No'}
                        </div>
                        <div>
                            <span className="font-semibold">Last Updated:</span>{' '}
                            {auth0User.updated_at ? new Date(auth0User.updated_at).toLocaleString() : 'N/A'}
                        </div>
                    </div>
                </div>
            </div>

            {showDebug && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="w-full">
                        <h3 className="text-xl font-semibold mb-2 text-gray-300">Database Record (Synced)</h3>
                        <div className="h-full">
                            <Highlight>{JSON.stringify(dbUser, null, 2)}</Highlight>
                        </div>
                    </div>
                    <div className="w-full">
                        <h3 className="text-xl font-semibold mb-2 text-gray-300">Auth0 Token Data</h3>
                        <div className="h-full">
                            <Highlight>{JSON.stringify(auth0User, null, 2)}</Highlight>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
