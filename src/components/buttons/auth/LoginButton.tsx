import { useAuth0 } from "@auth0/auth0-react";

const LoginButton: React.FC = () => {
	const { loginWithRedirect } = useAuth0();

	return (
		<button
			className={`
				text-gray-300 
				hover:bg-gray-700 
				hover:text-white rounded-md 
				px-3 py-3 text-sm font-medium
				m-0
				cursor-pointer
				w-full
			`}
			onClick={() => loginWithRedirect()}
		>
			Log In
		</button>
	);
}

export default LoginButton;