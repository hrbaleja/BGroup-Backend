// constants.js

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

    TRANSACTION_TYPES: {
        DEPOSIT: 'deposit',
        WITHDRAWAL: 'withdrawal'
    },

    MESSAGES: {
        ACCOUNT_NOTFOUND: `Account not found. Maybe it's on vacation?`,
        INSUFFICIENT_BALANCE: `Oops, looks like you don't have enough funds.`,
        ACCOUNT_REQUIRED: 'Hey, we need the Account ID !',
        TRANSACTION_SAVE: 'Hey, your money transaction is all good and saved !',
        TRANSACTION_ERR: 'Failed to save transaction. Please try again.',
        TRANSACTION_ERRGET: 'Failed to get transactions. Please try again.',
        ACCOUNT_CREATED: 'Account created successfully.',
        ACCOUNT_ERR: 'Failed to created Account. Please try again.',
        ACCOUNT_FETCHED: 'Accounts fetched successfully.',
        ACCOUNT_ERRFET: 'Failed fetch Accounts Account. Please try again.',
        USERS_WAFETCHED: 'Users without account fetched successfully.',

    }
};
