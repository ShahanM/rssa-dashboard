
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import Highlight from "../../components/Highlight";

const Profile = () => {
	const { user } = useAuth0();
	const navigate = useNavigate();

	if (user === undefined || user === null) {
		navigate("/");
		return <>Loading</>;
	}

	return (
		<div className="container mx-auto mb-5">
			<div className="flex flex-col md:flex-row items-center mb-5 text-center md:text-left">
				<div className="md:w-2/12">
					<img
						src={user.picture}
						alt="Profile"
						className="rounded-full w-full mb-3 md:mb-0"
					/>
				</div>
				<div className="md:w-full md:ml-6">
					<h2 className="text-2xl font-bold">{user.name}</h2>
					<p className="text-lg text-gray-500">{user.email}</p>
				</div>
			</div>
			<div className="w-full">
				<Highlight>{JSON.stringify(user, null, 2)}</Highlight>
			</div>
		</div>
	);
};



export default Profile;