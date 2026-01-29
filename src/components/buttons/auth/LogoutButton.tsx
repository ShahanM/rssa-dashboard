import { useAuth0 } from '@auth0/auth0-react';
import clsx from 'clsx';

const LogoutButton: React.FC = () => {
    const { logout } = useAuth0();

    const handleLogout = () => {
        logout({
            logoutParams: {
                returnTo: window.location.origin + '/rssa-dashboard/unauthorized',
            },
        });
    };

    return (
        <button
            className={clsx(
                'text-gray-300 hover:bg-gray-700',
                'hover:text-white rounded-md',
                'px-3 py-3 text-sm font-medium',
                'm-0 block w-full',
                'cursor-pointer'
            )}
            onClick={handleLogout}
        >
            Logout
        </button>
    );
};

export default LogoutButton;
