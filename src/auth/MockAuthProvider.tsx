import { User, type Auth0ContextInterface } from '@auth0/auth0-react';
import { AuthContext } from './AuthContext';

const mockPayloadObj = {
    permissions: ['admin:all'],
    sub: 'mock|12345',
};

const mockPayloadBase64 = btoa(JSON.stringify(mockPayloadObj));
const MOCK_JWT = `fakeHeader.${mockPayloadBase64}.fakeSignature`;

export const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
    const mockState = {
        isAuthenticated: true,
        isLoading: false,
        user: {
            name: 'Local Dev User',
            email: 'dev@rssa.local',
            sub: 'mock|12345',
        },
        getAccessTokenSilently: async () => MOCK_JWT,
        loginWithRedirect: async () => console.log('[Mock Auth] Login triggered'),
        logout: () => console.log('[Mock Auth] Logout triggered'),
        getAccessTokenWithPopup: async () => MOCK_JWT,
        getIdTokenClaims: async () => ({ __raw: MOCK_JWT }),
        loginWithPopup: async () => console.log('[Mock Auth] Popup login triggered'),
        handleRedirectCallback: async () => ({ appState: {} }),
        error: undefined,
    } as unknown as Auth0ContextInterface<User>;

    return <AuthContext.Provider value={mockState}>{children}</AuthContext.Provider>;
};
