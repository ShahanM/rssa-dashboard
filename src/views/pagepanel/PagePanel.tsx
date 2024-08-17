import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { HorizontalComponentList } from "../../components/componentlist/ComponentList";
import CreatePageForm from "../../components/forms/CreatePageForm";
import { isAuthError } from "../../utils/errors";
import { Page } from "../../utils/generics.types";
import { findFirstEmptyPosition, orderPosition } from "../../utils/utils";
import { PagePanelProps } from "./PagePanel.types";
import { getStepPages } from "../../api/endpoints";


const PagePanel: React.FC<PagePanelProps> = ({
	studyId, stepId, selected, onChangeSelection, authErrorCallback }) => {

	const [pages, setPages] = useState<Page[]>([]);
	const [show, setShow] = useState<boolean>(false);
	const { getAccessTokenSilently } = useAuth0();

	const handleSelection = (id: string) => {
		onChangeSelection({ studyId: selected.studyId, stepId: selected.stepId, pageId: id });
	}

	const handleCreateStudySuccess = (response: Page) => {
		setPages([...pages, response]);
	}

	const handleAuthError = (error: any) => {
		authErrorCallback((error as Error).message);
	}

	useEffect(() => {
		const callApi = async () => {
			try {
				const token = await getAccessTokenSilently();
				const response = await getStepPages(stepId, token);
				setPages(orderPosition(response));
			} catch (error) {
				if (isAuthError(error)) {
					authErrorCallback((error as Error).message);
				} else {
					// FIXME: Handle error
					console.log("We are in the error block", error);
				}
			}
		};
		if (studyId && stepId) callApi();
		else setPages([]);
	}, [getAccessTokenSilently, authErrorCallback, stepId, studyId]);


	return (
		<Container className="study-panel">
			<Row className="d-flex header">
				<Col md={8}>
					<h6>Showing pages for <b>Step:</b> {stepId}</h6>
				</Col>
				<Col md={4} className="header-button">
					<Button color="primary" onClick={() => setShow(true)}
						disabled={!stepId || stepId === ""}>
						Insert page
					</Button>
				</Col>
				<CreatePageForm
					studyId={studyId}
					stepId={stepId}
					maxEmptyPosition={findFirstEmptyPosition(pages)}
					show={show} showHideCallback={setShow}
					requestToken={getAccessTokenSilently}
					onSuccess={handleCreateStudySuccess}
					onAuthError={handleAuthError} />
			</Row>
			<Row>
				<HorizontalComponentList components={pages}
					selected={selected.studyId}
					onChangeSelection={handleSelection} />
			</Row>
		</Container>
	);
}


export default PagePanel;