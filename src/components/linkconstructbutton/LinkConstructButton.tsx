import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Page, SurveyConstruct } from '../../utils/generics.types';
import { emptyConstruct } from '../../utils/emptyinstances';
import { useAuth0 } from '@auth0/auth0-react';
import { getSurveyConstructs, linkConstructToPage } from '../../api/endpoints';


interface LinkConstructButtonProps {
	component: Page;
	linkCallback: (construct: SurveyConstruct) => void;
	enabled: boolean;
}

interface ConstructLibraryPopupProps {
	show: boolean;
	onHide: () => void;
	linkCallback: (id: string) => void;
	tokenRequest: () => Promise<string>;
}

export const ConstructLibraryPopup: React.FC<ConstructLibraryPopupProps> = ({ show, onHide, linkCallback, tokenRequest }) => {
	const [selectedConstruct, setSelectedConstruct] = useState<SurveyConstruct>(emptyConstruct);

	const [constructs, setConstructs] = useState<SurveyConstruct[]>([]);
	const [linkEnabled, setLinkEnabled] = useState<boolean>(false);

	const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const id = e.target.value;
		const construct = constructs.find((c) => c.id === id);
		if (construct) {
			setSelectedConstruct(construct);
		}
	}

	useEffect(() => {
		if (selectedConstruct.id !== "") {
			setLinkEnabled(true);
		} else {
			setLinkEnabled(false);
		}
	}, [selectedConstruct]);

	const handleLink = () => {
		linkCallback(selectedConstruct.id);
	}

	useEffect(() => {
		const fetchConstructs = async () => {
			try {
				const token = await tokenRequest();
				const response = await getSurveyConstructs(token);
				setConstructs(response);
			} catch (error) {
				console.error(error);
			}
		};
		if (show) fetchConstructs();
	}, [show, tokenRequest]);

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Select a survey construct</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group controlId="constructSelect">
						<Form.Label>Select a construct</Form.Label>
						<Form.Select onChange={handleSelect}>
							<option value="">Select a construct</option>
							{constructs.map((construct) => (
								<option key={construct.id} value={construct.id}>
									{construct.name}
								</option>
							))}
						</Form.Select>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onHide}>
					Close
				</Button>
				<Button variant="primary" onClick={handleLink}>
					Link construct
				</Button>
			</Modal.Footer>
		</Modal>
	);
}


const LinkConstructButton: React.FC<LinkConstructButtonProps> = ({ component, linkCallback, enabled }) => {

	const [showPopup, setShowPopup] = useState<boolean>(false);
	const { getAccessTokenSilently } = useAuth0();

	const linkConstruct = async (id: string) => {
		console.log(`Linking construct ${id} to component ${component.id}`);
		try {
			const token = await getAccessTokenSilently();
			const response = await linkConstructToPage({
				page_id: component.id,
				construct_id: id,
				order_position: 1
			}, token);
			linkCallback(response);
			setShowPopup(false);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<>
			<Button variant="primary" onClick={() => setShowPopup(true)}
				disabled={!enabled}>
				Link survey construct
			</Button>
			<ConstructLibraryPopup
				show={showPopup}
				onHide={setShowPopup.bind(null, false)}
				linkCallback={linkConstruct}
				tokenRequest={getAccessTokenSilently} />
		</>
	);
}

export default LinkConstructButton;