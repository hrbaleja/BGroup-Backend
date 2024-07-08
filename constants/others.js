module.exports = {
    STATUS: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        SERVER_ERROR: 500,
        NOTFOUND: 404
    },
    INCOME_METHODS: {
        CASH: 'Cash',
        BANK_TRANSFER: 'Bank Transfer',
        CREDIT_CARD: 'Credit Card',
        OTHER: 'Other'
    },
    MESSAGES: {
        INCOME_CREATED: 'Income entry created successfully.',
        INCOME_UPDATED: 'Income entry updated successfully.',
        INCOME_DELETED: 'Income entry deleted successfully.',
        INCOME_NOTFOUND: 'Income entry not found. Maybe it went on a spending spree?',
        INCOME_ERR_CREATE: 'Failed to create income entry. Please try again.',
        INCOME_ERR_UPDATE: 'Failed to update income entry. Please try again.',
        INCOME_ERR_DELETE: 'Failed to delete income entry. Please try again.',
        INCOME_ERR_FETCH: 'Failed to fetch income entries. Please try again.'
    }
};