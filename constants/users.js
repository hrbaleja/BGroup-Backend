module.exports = {
    STATUS: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        SERVER_ERROR: 500
    },
    MESSAGES: {
        CREDENTIALS_NOT_FOUND: 'User credentials not found. Please try again.',
        CREDENTIAL_CREATED: 'User credential created successfully.',
        CREDENTIAL_UPDATED: 'User credential updated successfully.',
        CREDENTIAL_DELETED: 'User credential deleted successfully.',
        ERROR_FETCH_CREDENTIALS: 'Error fetching user credentials. Please try again.',
        ERROR_CREATE_CREDENTIAL: 'Error creating user credential. Please try again.',
        ERROR_UPDATE_CREDENTIAL: 'Error updating user credential. Please try again.',
        ERROR_DELETE_CREDENTIAL: 'Error deleting user credential. Please try again.',

        USER_NOT_FOUND: 'User not found. Please try again.',
        USER_UPDATED: 'User updated successfully.',
        USER_STATUS_UPDATED: 'User status updated successfully.',
        USER_PASSWORD_UPDATED: 'User password updated successfully.',
        FORBIDDEN: 'You do not have permission to perform this action.',
        ERROR_FETCH_USERS: 'Error fetching users. Please try again.',
        ERROR_UPDATE_USER: 'Error updating user. Please try again.',
        ERROR_UPDATE_STATUS: 'Error updating user status. Please try again.',
        ERROR_UPDATE_PASSWORD: 'Error updating user password. Please try again.',

    }
};