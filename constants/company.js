module.exports = {
    STATUS: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        SERVER_ERROR: 500
    },
    MESSAGES: {

        COMPANY_CREATED: 'Company created successfully.',
        COMPANY_UPDATED: 'Company updated successfully.',
        COMPANY_DELETED: 'Company deleted successfully.',
        COMPANY_NOTFOUND: 'Company not found. Maybe it went out of business?',
        COMPANY_ERR_CREATE: 'Failed to create company. Please try again.',
        COMPANY_ERR_UPDATE: 'Failed to update company. Please try again.',
        COMPANY_ERR_DELETE: 'Failed to delete company. Please try again.',
        COMPANY_ERR_FETCH: 'Failed to fetch companies. Please try again.',

        INCOME_CREATED: 'Income created successfully.',
        INCOME_UPDATED: 'Income updated successfully.',
        INCOME_DELETED: 'Income deleted successfully.',
        INCOME_NOTFOUND: 'Income not found.',
        TRANSACTION_NOTFOUND: 'Transaction not found.',
      
        NO_INCOME_DATA: 'No income data found.',
        INCOME_ERR_CREATE: 'Failed to create income. Please try again.',
        INCOME_ERR_UPDATE: 'Failed to update income. Please try again.',
        INCOME_ERR_DELETE: 'Failed to delete income. Please try again.',
        INCOME_ERR_FETCH: 'Failed to fetch incomes. Please try again.',

        TRANSACTION_CREATED: 'Transaction created successfully.',
        TRANSACTION_UPDATED: 'Transaction updated successfully.',
        TRANSACTION_DELETED: 'Transaction deleted successfully.',
        TRANSACTION_NOTFOUND: 'Transaction not found.',
        COMPANY_NOTFOUND: 'Company not found.',
        USER_NOTFOUND: 'User not found.',
        TRANSACTION_EXISTS: 'A transaction with the same user and company already exists.',
        TRANSACTION_ERR_CREATE: 'Failed to create transaction. Please try again.',
        TRANSACTION_ERR_UPDATE: 'Failed to update transaction. Please try again.',
        TRANSACTION_ERR_DELETE: 'Failed to delete transaction. Please try again.',
        TRANSACTION_ERR_FETCH: 'Failed to fetch transactions. Please try again.',
        COMPANY_ID_REQUIRED: 'Company ID is required.',
    }
};

