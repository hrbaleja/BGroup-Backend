module.exports = {
    STATUS: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        NOT_FOUND: 404,
        SERVER_ERROR: 500
    },
    MESSAGES: {
        STATISTICS_ERR_FETCH: 'Failed to fetch dashboard statistics. Please try again.',

       
        SECTOR_ADDED_UPDATED: 'Sector added/updated successfully.',
        SECTOR_DELETED: 'Sector deleted successfully.',
        SECTORS_UPDATED: 'Sectors updated successfully.',
        SECTOR_NOTFOUND: 'Sector not found.',
        SECTOR_ERR_FETCH: 'Error fetching sectors.',
        SECTOR_ERR_ADD_UPDATE: 'Error adding/updating sector.',
        SECTOR_ERR_DELETE: 'Error deleting sector.',
        SECTOR_ERR_UPDATE: 'Error updating sectors.',
        SECTOR_ERR_FETCH_DATE: 'Error fetching sectors for date.',
        SECTOR_ERR_FETCH_LATEST: 'Error fetching latest sector values.',

       
        TASK_CREATED: 'Task created successfully.',
        TASK_UPDATED: 'Task updated successfully.',
        TASK_DELETED: 'Task deleted successfully.',
        TASK_NOTFOUND: 'Task not found.',
        TASK_ERR_FETCH: 'Error fetching tasks.',
        TASK_ERR_CREATE: 'Error creating task.',
        TASK_ERR_UPDATE: 'Error updating task.',
        TASK_ERR_DELETE: 'Error deleting task.'
    }
};