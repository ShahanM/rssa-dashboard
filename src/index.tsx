import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';


const AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN!;
const AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID!;
const AUTH0_AUDIENCE = process.env.REACT_APP_AUTH0_AUDIENCE!;

const onRedirectCallback = (appState: any) => {
	window.history.replaceState(
		{},
		document.title,
		appState && appState.targetUrl
			? appState.targetUrl
			: window.location.pathname
	);
};

const providerConfig = {
	domain: AUTH0_DOMAIN,
	clientId: AUTH0_CLIENT_ID,
	onRedirectCallback,
	authorizationParams: {
		redirect_uri: window.location.origin,
		...(AUTH0_AUDIENCE ? { audience: AUTH0_AUDIENCE } : null),
	},
};

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
	<React.StrictMode>
		<Auth0Provider
			{...providerConfig}
		>
			<App />
		</Auth0Provider>,
	</ React.StrictMode>
);

reportWebVitals(console.log);
