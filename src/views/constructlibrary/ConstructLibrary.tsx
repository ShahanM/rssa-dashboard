import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { useState } from "react";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";
import ConstructDetails from "../../components/constructdetails/ConstructDetails";
import ConstructList from "../../components/constructlist/ConstructList";
import CreateConstructForm from "../../components/forms/CreateConstructForm";
import './ConstructLibrary.css';


const ConstructLibrary = () => {

	const { getAccessTokenSilently,
		getAccessTokenWithPopup,
		loginWithPopup
	} = useAuth0();
	const [show, setShow] = useState(false);
	const [selectedConstructId, setSelectedConstructId] = useState<string>("");
	const [authError, setAuthError] = useState<string>("");
	const [refreshConstructList, setRefreshConstructList] = useState<boolean>(false);

	const handleConstructCreateSuccess = (constructId: string) => {
		setSelectedConstructId(constructId);
		setRefreshConstructList(true);
	}
	const handleConsent = async () => {
		try {
			await getAccessTokenWithPopup();
			setAuthError("");
		} catch (error) {
			setAuthError((error as Error).message);
		}
	};

	const handleLoginAgain = async () => {
		try {
			await loginWithPopup();
			setAuthError("");
		} catch (error) {
			setAuthError((error as Error).message);
		}
	};

	const handle = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
		fn: () => void) => {
		e.preventDefault();
		fn();
	};

	return (
		<Container>
			<Row>
				{authError === "consent_required" && (
					<Alert color="warning">
						You need to{" "}
						<a
							href="#/"
							className="alert-link"
							onClick={(e) => handle(e, handleConsent)}
						>
							consent to get access to users api
						</a>
					</Alert>
				)}

				{authError === "login_required" && (
					<Alert color="warning">
						You need to{" "}
						<a
							href="#/"
							className="alert-link"
							onClick={(e) => handle(e, handleLoginAgain)}
						>
							log in again
						</a>
					</Alert>
				)}
			</Row>
			<Row>
				<Col md={6}>
					<Container className="construct-lib">
						<Row className="d-flex header">
							<Col md={8}>
								<h6>Survey constructs</h6>
							</Col>
							<Col md={4} className="header-button">
								<Button color="primary" onClick={() => setShow(true)}>
									Create Construct
								</Button>
							</Col>
							<CreateConstructForm
								show={show}
								showHideCallback={setShow}
								requestToken={getAccessTokenSilently}
								onSuccess={handleConstructCreateSuccess}
								onAuthError={setAuthError} />
						</Row>
						<ConstructList onChangeSelection={setSelectedConstructId}
							refresh={refreshConstructList} refreshCallback={setRefreshConstructList} />
					</Container>
				</Col>
				<Col md={6}>
					<Container className="construct-lib">
						<ConstructDetails constructId={selectedConstructId} />
					</Container>
				</Col>
			</Row>
		</Container>
	);
}


export default withAuthenticationRequired(ConstructLibrary, {
	onRedirecting: () => <>Loading</>,
});
