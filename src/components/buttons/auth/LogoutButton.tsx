import clsx from 'clsx';
import { useAppAuth } from '../../../auth/AuthContext';

const LogoutButton: React.FC = () => {
    const { logout } = useAppAuth();

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
