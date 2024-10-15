import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { getSurveyConstructs } from '../../api/endpoints';
import { isAuthError } from '../../utils/errors';
import { SurveyConstruct } from '../../utils/generics.types';
import './ConstructList.css';


type ConstructListProps = {
	onChangeSelection: (constructId: string) => void;
	refresh: boolean;
	refreshCallback: (refresh: boolean) => void;
}

const ConstructList: React.FC<ConstructListProps> = ({ onChangeSelection, refresh, refreshCallback }) => {

	const [constructs, setConstructs] = useState<SurveyConstruct[]>([]);
	const { getAccessTokenSilently } = useAuth0();
	const [selectedConstructId, setSelectedConstructId] = useState<string>("");

	useEffect(() => {
		const callApi = async () => {
			try {
				const token = await getAccessTokenSilently();
				const response = await getSurveyConstructs(token);
				setConstructs(response);
			} catch (error) {
				if (isAuthError(error)) {
					// authErrorCallback((error as Error).message);
					console.log(error);
				} else {
					// FIXME: Handle error
					console.log("We are in the error block", error);
				}
			}
		};
		if (refresh || constructs.length === 0) {
			callApi();
			refreshCallback(false);
		}
	}, [getAccessTokenSilently, refresh, constructs, refreshCallback]);

	const handleSelection = (e: React.MouseEvent) => {
		const target = e.target as HTMLTableRowElement;
		const constructIdEle = target.parentElement?.getAttribute("construct-id");
		const constructId = constructIdEle ? constructIdEle : "";
		setSelectedConstructId(constructId);
		onChangeSelection(constructId);
	}

	return (
		<Container>
			<Row>
				<Table striped bordered hover className="construct-table">
					<thead>
						<tr>
							<th>Construct</th>
							<th>Type</th>
						</tr>
					</thead>
					<tbody>
						{constructs.map((construct) => {
							return (
								<tr key={"construct_" + construct.id}
									construct-id={construct.id}
									onClick={handleSelection}
									className={selectedConstructId === construct.id ? "selected" : ""}>
									<td>
										{construct.name}
									</td>
									<td>
										{construct.type.type}
									</td>
								</tr>
							)
						}
						)}
					</tbody>
				</Table>
			</Row>
		</Container>
	)
}

export default ConstructList;