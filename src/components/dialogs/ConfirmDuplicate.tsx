import React from 'react';
import { Modal, Button } from 'react-bootstrap';


export interface ConfirmDuplicateDialogProps {
	show: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

const ConfirmDuplicateDialog: React.FC<ConfirmDuplicateDialogProps> = ({ 
	show, 
	onClose,
	onConfirm }) => {

	return (
		<Modal show={show} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Confirm Duplicate</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>
					Are you sure you want to duplicate this study?
				</p>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={onClose} color="primary">
					Cancel
				</Button>
				<Button onClick={onConfirm} color="primary">
					Yes!
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default ConfirmDuplicateDialog;