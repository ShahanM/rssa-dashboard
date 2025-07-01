import { useAuth0 } from "@auth0/auth0-react";
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from "react-router-dom";
import './Navbar.css';

const NavBar = () => {
	const navigate = useNavigate();

	const {
		user,
		isAuthenticated,
		loginWithRedirect,
		logout,
	} = useAuth0();

	const logoutWithRedirect = () =>
		logout({ logoutParams: { returnTo: window.location.origin, } });

	return (
		<Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
			<Container>
				<Navbar.Brand onClick={() => navigate("/")}>RSSA</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
					<Nav className="rs-navbar">
						<Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
						{isAuthenticated &&
							<>
								<Nav.Link onClick={() => navigate("/studies")}>Studies</Nav.Link>
								<Nav.Link onClick={() => navigate("/survey-construct-library")}>Construct Library</Nav.Link>
								<Nav.Link onClick={() => navigate("/metainfo-control")}>Meta Info Control</Nav.Link>
							</>
						}
						{(isAuthenticated && user) && (
							<NavDropdown title={(
								<Image src={user.picture}
									alt="Profile picture"
									roundedCircle
									width="50"
								/>
							)} id="profileDropDown">
								<NavDropdown.Item onClick={() => navigate("/profile")}>Profile</NavDropdown.Item>
								<NavDropdown.Item id="qsLogoutBtn" onClick={() => logoutWithRedirect()}>
									Logout
								</NavDropdown.Item>
							</NavDropdown>
						)}
						{!isAuthenticated && (
							<Nav>
								<Nav.Link id="qsLoginBtn" onClick={() => loginWithRedirect({})}>Log in</Nav.Link>
							</Nav>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default NavBar;
