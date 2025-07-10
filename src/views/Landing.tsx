import React from 'react';
import { withAuthenticationRequired } from '@auth0/auth0-react';

export const Landing: React.FC = () => {
	return (
		<div>
			<h1>Landing Page</h1>
		</div>
	)
}

export default withAuthenticationRequired(Landing, {
	onRedirecting: () => <>Loading</>,
});