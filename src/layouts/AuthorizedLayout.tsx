import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/Navbar";
import useDocumentTitle from "../hooks/useDocumentTitle";

const AuthorizedLayout: React.FC = () => {

	useDocumentTitle("Control Panel");
	return (
		<>
			<NavBar />
			<Outlet />
		</>
	)
}

const ProtectedAuthorizedLayout = withAuthenticationRequired(AuthorizedLayout, {
	onRedirecting: () => {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center">
					<h2 className="text-2xl font-semibold mb-4">Redirecting...</h2>
					<p className="text-gray-500">Please wait while we redirect you to the login page.</p>
				</div>
			</div>
		);
	}
});
export default ProtectedAuthorizedLayout;