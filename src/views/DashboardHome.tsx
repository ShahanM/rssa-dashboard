import { useAuth0 } from "@auth0/auth0-react";
import UserCard from "./profile/UserCard";

const DashboardHome: React.FC = () => {
	const { user } = useAuth0();

	if (!user) {
		return <></>;
	}

	return (
		<div className="m-5 border-1 p-3 rounded-lg border-gray-300">
			{user.sub && <UserCard userId={user.sub} />}
			<div className="mt-3">
				<p>You are current logged in as <span className="text-blue-700">{user.nickname}</span></p>
				<p>The RSSA system knows you as <span className="text-blue-700">{user.sub}</span></p>
				<p>
					If you do not see any navigation options above, please contact the site administrator. At this moment
					that would be Mehtab "Shahan" Iqbal. Email: <span className="text-blue-700">mehtabi [at] clemson [dot] edu</span>
				</p>
			</div>
		</div>
	);
}

export default DashboardHome;