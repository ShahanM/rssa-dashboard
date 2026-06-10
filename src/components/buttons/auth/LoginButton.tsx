import clsx from 'clsx';
import { useAppAuth } from '../../../auth/AuthContext';

const LoginButton: React.FC = () => {
    const { loginWithRedirect } = useAppAuth();

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
