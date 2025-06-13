
// Helper function to get current financial year date range
function getCurrentFinancialYear() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    let startYear = currentMonth >= 4 ? currentYear : currentYear - 1;
    let endYear = startYear + 1;

    return {
        startDate: new Date(`${startYear}-04-01`),
        endDate: new Date(`${endYear}-03-31`)
    };
}

module.exports = { getCurrentFinancialYear };
