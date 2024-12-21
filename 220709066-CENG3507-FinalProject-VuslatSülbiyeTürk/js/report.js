// Gets sales information from locastorage
function getSalesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('sales')) || [];
}

// Gets packaging information from locastorage
function getPackageReportsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('packageReports')) || [];
}

// Gets purchase information from locastorage
function getPurchaseRecordsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('purchaseRecords')) || [];
}

// Gets berries information from localstorage
function getBerriesFromLocalStorage() {
    const berries = localStorage.getItem('berries');
    return berries ? JSON.parse(berries) : [];
}

// Gets farners information from localstorage
function getFarmersFromLocalStorage() {
    const berries = localStorage.getItem('farmers');
    return berries ? JSON.parse(berries) : [];
}

// Gets package categories from localstorage
function getCategoriesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('categories')) || [];
}


// Gets farmer name by farmer ıd 
function getFarmerNameById(farmerId) {
    const farmers = getFarmersFromLocalStorage();
    const farmer = farmers.find(f => f.farmerId === farmerId);
    return farmer ? farmer.farmerFName + farmer.farmerLName : 'Unknown Farmer';
}

// gets berry name by berry ıd
function getBerryNameById(berryId) {
    const berries = getBerriesFromLocalStorage();
    const berry = berries.find(b => b.berryId === berryId);
    return berry ? berry.berryName : 'Unknown Berry';
}

// Gets category name by category ıd
function getCategoryNameById(categoryId) {
    const categories = getCategoriesFromLocalStorage();
    const category = categories.find(c => c.categoryId === categoryId);
    return category ? category.categoryName : 'Unknown Category';
}

// Empty list for listing all records sorted
let sortedRecords = [];

// Function for displaying all records
function displayData() {
    sortedRecords = [];
    const saleRecords = getSalesFromLocalStorage();
    const purchases = getPurchaseRecordsFromLocalStorage();
    const packages = getPackageReportsFromLocalStorage();

    // Takes all data
    let allRecords = [...saleRecords, ...purchases, ...packages];

    // Convert DD/MM/YYYY to YYYY-MM-DD format for sorting
    function normalizeDate(dateString) {
        const parts = dateString.split('/'); // Split into [DD, MM, YYYY]
        return `${parts[2]}-${parts[1]}-${parts[0]}`; // Return in YYYY-MM-DD format
    }

    // Sorts dates from records using normalized date format
    allRecords.sort((a, b) => {
        const dateA = normalizeDate(a.date);
        const dateB = normalizeDate(b.date);
        return dateA.localeCompare(dateB); // String comparison for dates
    });

    let reportTable = document.querySelector('.report-table');

    // Table head writing
    let thead = reportTable.querySelector('thead');
    if (!thead) {
        thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th rowspan="2">Type</th>
                <th rowspan="2">Date</th>
                <th rowspan="2">ID</th>
                <th rowspan="2">Customer/Farmer/Berry ID</th>
                <th rowspan="2">Quantity</th>
                <th rowspan="2">Price/Cost</th>
                <th colspan="3">Additional Info</th>
            </tr>
        `;
        reportTable.appendChild(thead);
    }

    let tbody = reportTable.querySelector('tbody');
    if (!tbody) {
        tbody = document.createElement('tbody');
        reportTable.appendChild(tbody);
    }

    // Adds all records to table
    tbody.innerHTML = '';
    allRecords.forEach(record => {
        let row = document.createElement('tr');

        let type = '';
        let id = '';
        let customerOrFarmerOrBerry = '';
        let quantity = '';
        let priceOrCost = '';
        let status = '';
        let kdv = '';
        let berryType = '-';

        if (record.orderId) { // Sales
            type = 'Sale';
            id = record.orderId;
            customerOrFarmerOrBerry = record.customerName;
            quantity = record.quantity;
            priceOrCost = record.totalPrice;
            status = `Status: ${record.orderStatus}`;
            kdv = ` KDV: ${record.kdv}`;
            berryType = `Berry Type: ${getBerryNameById(record.berryId)} Package Type: ${getsCategoriesNameById(record.categoryId)}`;

            sortedRecords.push({
                type,
                date: record.date,
                id,
                customerOrFarmerOrBerry,
                berryType,
                quantity,
                priceOrCost,
                status,
                kdv,
                berryType
            });

        } else if (record.purchaseID) { // Purchase
            type = 'Purchase';
            id = record.purchaseID;
            customerOrFarmerOrBerry = getFarmerNameById(record.farmerID);
            quantity = record.quantity;
            priceOrCost = record.totalCost;
            status = `Berry Name: ${getBerryNameById(record.berryID)}`;
            kdv = ` Price Per Kg: ${record.pricePerKg}`;

            sortedRecords.push({
                type,
                date: record.date,
                id,
                customerOrFarmerOrBerry,
                quantity,
                priceOrCost,
                status,
                kdv
            });

        } else if (record.packagingId) { // Packaging
            type = 'Packaging';
            id = record.packagingId;
            customerOrFarmerOrBerry = getBerryNameById(record.berryId);
            quantity = `${record.quantity} package`;
            priceOrCost = '-';
            status = `Package Type: ${getCategoryNameById(record.categoryId)}`;
            kdv = ` Storage: ${record.storageLocation}`;

            sortedRecords.push({
                type,
                date: record.date,
                id,
                customerOrFarmerOrBerry,
                quantity,
                priceOrCost,
                status,
                kdv
            });
        }

        row.innerHTML = `
            <td>${type}</td>
            <td>${record.date}</td>
            <td>${id}</td>
            <td>${customerOrFarmerOrBerry}</td>
            <td>${quantity}</td>
            <td>${priceOrCost}</td>
            <td>${status}</td>
            <td>${kdv}</td>
            <td>${berryType}</td>
        `;
        tbody.appendChild(row);
    });
    console.log(sortedRecords);
}


// Function for showing records table by search input
function renderReports(records) {
    const reportTableBody = document.querySelector('.report-table tbody');

    reportTableBody.innerHTML = '';

    // Checks if there is a record or not
    if (records.length === 0) {
        const noDataMessage = document.createElement('tr');
        noDataMessage.innerHTML = `
            <td colspan="8" style="text-align: center;">No matching records found.</td>
        `;
        reportTableBody.appendChild(noDataMessage);
        return;
    }

    // Adds filtered records to table
    records.forEach(record => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${record.type || ''}</td>
            <td>${record.date || ''}</td>
            <td>${record.id || ''}</td>
            <td>${record.customerOrFarmerOrBerry || ''}</td>
            <td>${record.quantity || ''}</td>
            <td>${record.priceOrCost || ''}</td>
            <td>${record.status || ''}</td>
            <td>${record.kdv || ''}</td>
            <td>${record.berryType || '-'}</td>
        `;

        reportTableBody.appendChild(row);
    });
}

// Function for filtering records for searching
function filterReports() {
    const searchValue = document.getElementById('report-search-input').value.trim().toLowerCase();

    // Filtering sortedRecords
    const filteredRecords = sortedRecords.filter(record => {
        const type = record.type || '';
        const date = record.date || '';
        const id = record.id || '';
        const customerOrFarmerOrBerry = record.customerOrFarmerOrBerry || '';
        const quantity = String(record.quantity || '');
        const priceOrCost = String(record.priceOrCost || '');
        const status = record.status || '';
        const kdv = record.kdv || '';
        const berryType = record.berryType || '';

        const combinedData = `${type} ${date} ${id} ${customerOrFarmerOrBerry} ${quantity} ${priceOrCost} ${status} ${kdv} ${berryType}`.toLowerCase();
        return combinedData.includes(searchValue);
    });

    renderReports(filteredRecords);
}

// Helper function to parse DD/MM/YYYY format
function parseDate(dateStr) {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
}

// Function for filtering all records by time range
function filterAndCalculateReport(records, timeRange) {
    const today = new Date();
    let startDate, endDate;

    // Determine the start and end date based on time range
    if (timeRange === "daily") {
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    } else if (timeRange === "weekly") {
        const firstDayOfWeek = today.getDate() - ((today.getDay() + 6) % 7); // Monday is first day of the week
        startDate = new Date(today.getFullYear(), today.getMonth(), firstDayOfWeek);
        endDate = new Date(today.getFullYear(), today.getMonth(), firstDayOfWeek + 7);
    } else if (timeRange === "monthly") {
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    } else if (timeRange === "yearly") {
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear() + 1, 0, 1);
    } else {
        // All records
        startDate = null;
        endDate = null;
    }

    // Filtering
    const filteredRecords = records.filter(record => {
        const recordDate = parseDate(record.date);
        if (startDate && endDate) {
            return recordDate >= startDate && recordDate < endDate;
        }
        return true; // All records
    });

    // Calculation
    let totalIncome = 0;
    let totalTax = 0;
    let totalExpenses = 0;

    filteredRecords.forEach(record => {
        totalIncome += record.totalPrice || 0;
        totalTax += record.kdv || 0;
        totalExpenses += record.totalCost || 0;
    });

    return { totalIncome, totalTax, totalExpenses };
}

// Function for calculating reports summary 
function calculateAndDisplayReports() {
    const timeRange = document.getElementById('timePeriod').value; // Time range
    const sales = getSalesFromLocalStorage();
    const purchaseRecords = getPurchaseRecordsFromLocalStorage();

    // Filters financial reports
    const salesSummary = filterAndCalculateReport(sales, timeRange);
    const purchaseSummary = filterAndCalculateReport(purchaseRecords, timeRange);

    // Calculates financial values
    const totalIncome = salesSummary.totalIncome;
    const totalTax = salesSummary.totalTax;
    const totalExpenses = purchaseSummary.totalExpenses;

    updateReportsDivSummary(timeRange, totalIncome, totalTax, totalExpenses);
}

// Shows report financial summary
function updateReportsDivSummary(timeRange, income, tax, expenses) {
    const summaryDiv = document.getElementById('income-report-div');
    const netProfit = income - tax - expenses;
    summaryDiv.innerHTML = `
        <h3>${(timeRange.charAt(0).toUpperCase() + timeRange.slice(1))} Financial Summary</h3>
        <p><strong>Total Income:</strong> $${income.toFixed(2)}</p>
        <p><strong>Total Tax:</strong> $${tax.toFixed(2)}</p>
        <p><strong>Total Expenses:</strong> $${expenses.toFixed(2)}</p>
        <p><strong>Net Profit:</strong> $${netProfit.toFixed(2)}</p>
    `;
}

// Changes financial summary when time range changes
document.getElementById('timePeriod').addEventListener('change', calculateAndDisplayReports);

// Event listener for calling functions when report section opened
document.getElementById('report-btn').addEventListener('click', () => {
    displayData();
    calculateAndDisplayReports();
    changeSections();
});

// Gets category name from categories
function getsCategoriesNameById(categoryId) {
    const categories = getCategoriesFromLocalStorage();
    const category = categories.find(c => c.categoryId === categoryId);
    return category ? category.categoryName : 'Unknown Category';
}
