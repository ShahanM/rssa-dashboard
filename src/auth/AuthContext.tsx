import { initialContext, type Auth0ContextInterface } from '@auth0/auth0-react';
import { createContext, useContext } from 'react';

export const AuthContext = createContext<Auth0ContextInterface>(initialContext);

export const useAppAuth = () => useContext(AuthContext);
