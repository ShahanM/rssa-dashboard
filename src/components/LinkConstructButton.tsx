import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { PageContent } from '../api/api.types';
import { useApi } from '../hooks/useApi';
import { SurveyConstruct } from '../utils/generics.types';
import { SurveyPage } from '../views/studycomponents/PageDetails';


interface LinkConstructButtonProps {
	component: SurveyPage;
	onSuccess: () => void;
	// linkCallback: (construct: SurveyConstruct) => void;
	// enabled: boolean;
}

interface ConstructLibraryPopupProps {
	show: boolean;
	onHide: () => void;
	linkCallback: (id: string) => void;
	// tokenRequest: () => Promise<string>;
}

export const ConstructLibraryPopup: React.FC<ConstructLibraryPopupProps> = ({ show, onHide, linkCallback }) => {
	const [selectedConstruct, setSelectedConstruct] = useState<SurveyConstruct>();

	const [linkEnabled, setLinkEnabled] = useState<boolean>(false);
	const { data: constructs, loading, error, api } = useApi<SurveyConstruct[]>();


	const fetchConstructsForLinking = useCallback(async () => {
		try {
			await api.get("constructs/");
		} catch (error) {
			console.log("Error fetching construct list.");
		}
	}, [api])

	useEffect(() => { fetchConstructsForLinking() }, [fetchConstructsForLinking]);

	useEffect(() => {
		if (constructs) {
			console.log("Constructs ", constructs);
		}
	}, [constructs])

	const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const id = e.target.value;
		if (constructs) {
			const construct = constructs.find((c) => c.id === id);
			if (construct) {
				setSelectedConstruct(construct);
			}
		}
	}

	useEffect(() => {
		if (selectedConstruct) {
			if (selectedConstruct.id !== "") {
				setLinkEnabled(true);
			} else {
				setLinkEnabled(false);
			}
		}
	}, [selectedConstruct]);

	const handleLink = () => {
		if (selectedConstruct) {
			linkCallback(selectedConstruct.id);
		}
	}

	if (!constructs) {
		return (
			<Modal show={show} onHide={onHide}>
				<Modal.Header closeButton>
					<Modal.Title>Select a survey construct</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Loading constructs
				</Modal.Body>
			</Modal>
		)
	}

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


const LinkConstructButton: React.FC<LinkConstructButtonProps> = ({ component, onSuccess }) => {

	const [showPopup, setShowPopup] = useState<boolean>(false);
	const { data: pageContent, loading, error, api } = useApi<PageContent>();

	const lastConstructOrderPos = useMemo(() => {
		const lastOrderPosition = component?.page_contents?.[component.page_contents.length - 1]?.order_position;
		return (lastOrderPosition ?? 0) + 1;
	}, [component?.page_contents]);

	const linkConstructHandler = useCallback(async (selectedConstructId: string) => {
		if (selectedConstructId) {
			console.log("Selected ID", selectedConstructId);
			await api.post(`pages/${component.id}`, {
				construct_id: selectedConstructId,
				page_id: component.id,
				order_position: lastConstructOrderPos
			});

		}
	}, [api, component.id, lastConstructOrderPos])

	useEffect(() => {
		if (pageContent) {
			setShowPopup(false);
			onSuccess();
		}
	}, [pageContent, onSuccess]);


	return (
		<>
			<Button variant="primary" onClick={() => setShowPopup(true)}>
				Link survey construct
			</Button>
			<ConstructLibraryPopup
				show={showPopup}
				onHide={setShowPopup.bind(null, false)}
				linkCallback={linkConstructHandler} />
		</>
	);
}

export default LinkConstructButton;