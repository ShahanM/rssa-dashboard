import { Auth0Provider, type Auth0ProviderOptions } from '@auth0/auth0-react';
import { Auth0Adapter } from './Auth0Adapter';
import { MockAuthProvider } from './MockAuthProvider';

export const AuthProvider = ({ children, ...providerConfig }: Auth0ProviderOptions) => {
    const useMock = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

    if (useMock) {
        return <MockAuthProvider>{children}</MockAuthProvider>;
    }

    return (
        <Auth0Provider {...providerConfig}>
            <Auth0Adapter>{children}</Auth0Adapter>
        </Auth0Provider>
    );
};
