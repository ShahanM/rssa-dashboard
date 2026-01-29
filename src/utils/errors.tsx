const AUTH_ERROR_MESSAGES = ['consent_required', 'login_required'];

export function isAuthError(error: any): boolean {
    return (error as Error).message in AUTH_ERROR_MESSAGES;
}
