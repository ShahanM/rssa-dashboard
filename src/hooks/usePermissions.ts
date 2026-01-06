import { useAuth0 } from '@auth0/auth0-react';
import { useQuery } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';

const PERMISSIONS_CLAIM = 'permissions';

interface DecodedAccessToken {
    [key: string]: unknown;
    [PERMISSIONS_CLAIM]?: string[];
}

export const usePermissions = () => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    const {
        data: permissions = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['user-permissions'],

        queryFn: async (): Promise<string[]> => {
            const accessToken = await getAccessTokenSilently();
            const decodedToken = jwtDecode<DecodedAccessToken>(accessToken);
            return decodedToken[PERMISSIONS_CLAIM] || [];
        },

        enabled: isAuthenticated,

        staleTime: 5 * 60 * 1000, // Cache permissions for 5 minutes
        refetchOnWindowFocus: true, // Refetch if user comes back to the tab
    });

    const hasPermission = (permission: string): boolean => {
        return permissions.includes(permission) || permissions.includes('admin:all');
    };

    return {
        permissions,
        hasPermission,
        isLoadingPermissions: isLoading,
        permissionsError: isError,
    };
};
