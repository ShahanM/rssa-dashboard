import { useAuth0 } from '@auth0/auth0-react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../hooks/useApi';
import UserCard from './profile/UserCard';

const DashboardHome: React.FC = () => {
    const { user } = useAuth0();
    const { api } = useApi();

    const { data: dbUser } = useQuery({
        queryKey: ['users', 'me'],
        queryFn: async () => {
            return await api.get<{ id: string }>('users/me');
        },
        enabled: !!user,
    });

    if (!user) {
        return <></>;
    }

    return (
        <div className="m-5 border-1 p-3 rounded-lg border-gray-300">
            {dbUser?.id && <UserCard userId={dbUser.id} />}
            <div className="mt-3">
                <p>
                    You are current logged in as <span className="text-blue-700">{user.nickname}</span>
                </p>
                <p>
                    The RSSA system knows you as <span className="text-blue-700">{dbUser?.id || '...'}</span>
                </p>
                <p>
                    If you do not see any navigation options above, please contact the site administrator. At this
                    moment that would be Mehtab "Shahan" Iqbal. Email:{' '}
                    <span className="text-blue-700">mehtabi [at] clemson [dot] edu</span>
                </p>
            </div>
        </div>
    );
};

export default DashboardHome;
