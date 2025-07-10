import { useCallback, useEffect, useState } from 'react';
import { Button, Col } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { useApi } from '../../hooks/useApi';
import { SurveyConstruct } from '../../utils/generics.types';


type ConstructListProps = {
	selectedConstructId: string | undefined;
	onChangeSelection: (constructId: string) => void;
	authErrorCallback: (errorMessage: string) => void;
}

const ConstructList: React.FC<ConstructListProps> = ({ selectedConstructId, onChangeSelection, authErrorCallback }) => {
	const [show, setShow] = useState<boolean>(false);
	const { data: constructs, loading, error, api } = useApi<SurveyConstruct[]>();


	const handleSelection = (constructId: string) => {
		onChangeSelection(constructId);
	}

	const fetchConstructs = useCallback(async () => {
		try {
			await api.get("constructs/");
		} catch (error) {
			console.error("Error fetching constructs:", error);
		}
	}, [api]);

	useEffect(() => { fetchConstructs(); }, [fetchConstructs]);

	if (loading) {
		return <div>Loading constructs...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	if (!constructs || constructs.length === 0) {
		return <div>No constructs available.</div>;
	} else {
		console.log("Constructs fetched:", constructs);
	}

	return (
		<Container className="list-container">
			<Row className="header">
				<Col md={8}>
					<h2>Survey Constructs</h2>
				</Col>
				<Col md={4} className="header-button-container">
					<Row>
						<Button className="header-button" color="primary" onClick={() => setShow(true)}>
							Create construct
						</Button>
						{/* <Button className="header-button" color="primary" onClick={() => setConfirmDupe(true)}
											disabled={!(selectedStudyId && selectedStudyId.length > 0)}>
											Duplicate Study
										</Button> */}
					</Row>
				</Col>
			</Row>
			<Row>
				<Table striped bordered hover className="construct-table">
					<thead>
						<tr>
							<th>Construct</th>
						</tr>
					</thead>
					<tbody>
						{constructs.map((construct) => {
							return (
								<tr key={"construct_" + construct.id}
									construct-id={construct.id}
									onClick={() => handleSelection(construct.id)}
									className={selectedConstructId === construct.id ? "selected" : ""}>
									<td>
										{construct.name}
									</td>
								</tr>
							)
						}
						)}
					</tbody>
				</Table>
			</Row>
		</Container >
	)
}

export default ConstructList;