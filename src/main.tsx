import './wdyr.ts';
import { Auth0Provider, type AppState } from '@auth0/auth0-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.tsx';
import { store } from './store/store.ts';
import { ApiProvider } from './api/ApiProvider.tsx';

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;
const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;

const queryClient = new QueryClient();

const onRedirectCallback = (appState?: AppState) => {
    window.history.replaceState(
        {},
        document.title,
        appState?.targetUrl ? appState.targetUrl : window.location.pathname
    );
};

const providerConfig = {
    domain: AUTH0_DOMAIN,
    clientId: AUTH0_CLIENT_ID,
    onRedirectCallback,
    authorizationParams: {
        redirect_uri: window.location.origin + '/rssa-dashboard/',
        ...(AUTH0_AUDIENCE ? { audience: AUTH0_AUDIENCE } : null),
    },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <Auth0Provider {...providerConfig}>
                <Provider store={store}>
                    <ApiProvider>
                        <App />
                        <ReactQueryDevtools initialIsOpen={false} />
                    </ApiProvider>
                </Provider>
            </Auth0Provider>
        </QueryClientProvider>
    </React.StrictMode>
);
