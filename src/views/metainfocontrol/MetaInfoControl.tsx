import { withAuthenticationRequired } from '@auth0/auth0-react';
import { Container, Row } from 'react-bootstrap';
import {
	ConstructScaleWidget,
	ConstructTypeWidget,
	ItemTypeWidget,
	ParticipantTypeWidget
} from '../../components/metadatawidgets/MetadataWidgets';
import './MetaInfoControl.css';

const MetaInfoControl = () => {
	return (
		<Container>
			<h1>Meta Info Control</h1>
			<Row className="metainfo-widget">
				<ConstructTypeWidget />
			</Row>
			<Row className="metainfo-widget">
				<ConstructScaleWidget />
			</Row>
			<Row className="metainfo-widget">
				<ItemTypeWidget />
			</Row>
			<Row className="metainfo-widget">
				<ParticipantTypeWidget />
			</Row>
		</Container>
	);
}


export default withAuthenticationRequired(MetaInfoControl, {
	onRedirecting: () => <>Loading</>,
});
