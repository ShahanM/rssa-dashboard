import { useAuth0 } from '@auth0/auth0-react';
import { AuthContext } from './AuthContext';

export const Auth0Adapter = ({ children }: { children: React.ReactNode }) => {
    const auth0State = useAuth0();
    return <AuthContext.Provider value={auth0State}>{children}</AuthContext.Provider>;
};
