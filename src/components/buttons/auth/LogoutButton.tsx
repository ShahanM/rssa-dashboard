import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton: React.FC = () => {
	const { logout } = useAuth0();
	return (
		<button
			className={`
				text-gray-300 
				hover:bg-gray-700 
				hover:text-white rounded-md 
				px-3 py-3 text-sm font-medium
				m-0
				cursor-pointer
				block
				w-full
			`}
			onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
		>
			Logout
		</button>
	);
}

export default LogoutButton;