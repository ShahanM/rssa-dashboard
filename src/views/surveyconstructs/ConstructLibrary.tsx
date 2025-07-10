import { withAuthenticationRequired } from "@auth0/auth0-react";
import { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthErrorAlert from "../../components/AuthErrorAlert";
import ConstructList from "./ConstructList";
import ConstructSummaryView from "./ConstructSummary";

const ConstructLibrary = () => {
	const [authError, setAuthError] = useState<string>("");
	const [selectedConstructId, setSelectedConstructId] = useState<string>();

	const handleSelection = (constructId: string) => {
		setSelectedConstructId(constructId);
	}

	return (
		<Container id="content-overview">
			<AuthErrorAlert error={authError} />
			<Row className="navigation-row d-flex mt-4">
				<Col md={{ span: 5 }}>
					<ConstructList
						authErrorCallback={setAuthError}
						selectedConstructId={selectedConstructId}
						onChangeSelection={handleSelection}
					/>
				</Col>
				<Col md={{ span: 7 }}>
					<Row>
						<Link to={`/constructs/${selectedConstructId}`}>
							<Button>Show details &gt;</Button>
						</Link>
					</Row>
					<Row className="mt-3">
						<ConstructSummaryView
							constructId={selectedConstructId}
							authErrorCallback={setAuthError}
						/>
					</Row>
				</Col>
			</Row>
		</Container>
	);
}


export default withAuthenticationRequired(ConstructLibrary, {
	onRedirecting: () => <>Loading</>,
});
