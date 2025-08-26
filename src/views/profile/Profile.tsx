
import { useAuth0 } from "@auth0/auth0-react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
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
		<Container className="mb-5">
			<Row className="align-items-center profile-header mb-5 text-center text-md-left">
				<Col md={2}>
					<img
						src={user.picture}
						alt="Profile"
						className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
					/>
				</Col>
				<Col md>
					<h2>{user.name}</h2>
					<p className="lead text-muted">{user.email}</p>
				</Col>
			</Row>
			<Row>
				<Highlight>{JSON.stringify(user, null, 2)}</Highlight>
			</Row>
		</Container>
	);
};



export default Profile;