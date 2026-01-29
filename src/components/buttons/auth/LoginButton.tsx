import { useAuth0 } from '@auth0/auth0-react';
import clsx from 'clsx';

const LoginButton: React.FC = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <button
            className={clsx(
                'bg-yellow-400 text-gray-800',
                'hover:bg-orange-400',
                'hover:text-gray-800 rounded-md',
                'w-full m-0 px-3 py-3 text-sm font-medium',
                'cursor-pointer'
            )}
            onClick={() => loginWithRedirect()}
        >
            Log In
        </button>
    );
};

export default LoginButton;
