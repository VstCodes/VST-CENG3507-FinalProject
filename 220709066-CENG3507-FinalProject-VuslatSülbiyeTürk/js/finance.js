// Gets sales information from localstorage
function getSalesFromLocalStorage(){
    return JSON.parse(localStorage.getItem('sales')) || [];
}
// Gets purchase records from localstorage
function getPurchaseRecordsFromLocalStorage(){
    return JSON.parse(localStorage.getItem('purchaseRecords')) || [];
}
// Gets package categories from localstorage
function getCategoriesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('categories')) || [];
}
// Gets berries information from localstorage
function getBerriesFromLocalStorage() {
    const berries = localStorage.getItem('berries');
    return berries ? JSON.parse(berries) : [];
}

// Gets category name from categories
function getsCategoryNameById(categoryId) {
    const categories = getCategoriesFromLocalStorage();
    const category = categories.find(c => c.categoryId === categoryId);
    return category ? category.categoryName : 'Unknown Category';
}
// Gets farmers information from localstorage
function getFarmersFromLocalStorage() {
    const farmers = localStorage.getItem('farmers');
    return farmers ? JSON.parse(farmers) : [];
}
// Gets berries name from berries
function getsBerryNameById(berryID) {
    const berries = getBerriesFromLocalStorage();
    const berry = berries.find(b => b.berryId === berryID);
    return berry ? berry.berryName : 'Unknown Berry';
}
// Gets farmer name from farmers
function getsFarmerNameById(farmerID) {
    const farmers = getFarmersFromLocalStorage();
    const farmer = farmers.find(f => f.farmerId === farmerID);
    return farmer ? (farmer.farmerFName + farmer.farmerLName) : 'Unknown Farmer';
}

// Function for showing sale records
function showSalesTable() {
    const sales = getSalesFromLocalStorage();
    const tableBody = document.querySelector('#sales-data-table tbody');
    tableBody.innerHTML = '';

    // Adds sale information to table
    sales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.orderId}</td>
            <td>${sale.date}</td>
            <td>${sale.customerName}</td>
            <td>${sale.customerContact}</td>
            <td>${sale.shippingAddress}</td>
            <td>${getsCategoryNameById(sale.categoryId)}</td>
            <td>${sale.quantity}</td>
            <td>${sale.totalPrice}</td>
            <td>${sale.orderStatus}</td>
            <td>${sale.kdv}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Function for showing purchase records
function showPurchaseTable() {
    const purchaseRecords = getPurchaseRecordsFromLocalStorage();
    const tableBody = document.querySelector('#purchase-data-table tbody');
    tableBody.innerHTML = '';

    // Adds purchase information to table
    purchaseRecords.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.purchaseID}</td>
            <td>${record.date}</td>
            <td>${getsFarmerNameById(record.farmerID)}</td>
            <td>${getsBerryNameById(record.berryID)}</td>
            <td>${record.quantity}</td>
            <td>${record.pricePerKg}</td>
            <td>${record.totalCost}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Add event listener to farmer-btn for display farmer info
document.getElementById('finance-btn').addEventListener('click', () => {
    showPurchaseTable();
    showSalesTable();
    calculateAndDisplayFinancials();
    changeSections();
});

// Filters sales and purchases by time range
function filterAndCalculateFinancials(records, timeRange) {
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

// Calculates financial informations
function calculateAndDisplayFinancials() {
    const timeRange = document.getElementById('financeTimePeriod').value; // gets time range
    const sales = getSalesFromLocalStorage(); 
    const purchaseRecords = getPurchaseRecordsFromLocalStorage(); 

    // Filters sales and purchases by choosen time range
    const salesSummary = filterAndCalculateFinancials(sales, timeRange);
    const purchaseSummary = filterAndCalculateFinancials(purchaseRecords, timeRange);

    // Calculates financial values
    const totalIncome = salesSummary.totalIncome;
    const totalTax = salesSummary.totalTax;
    const totalExpenses = purchaseSummary.totalExpenses;

    updateFinancialSummaryDiv(timeRange, totalIncome, totalTax, totalExpenses);
}

// Shows financial summary
function updateFinancialSummaryDiv(timeRange, income, tax, expenses) {
    const summaryDiv = document.getElementById('financial-summary');
    const profit = income - tax - expenses;
    summaryDiv.innerHTML = `
        <h3>${(timeRange.charAt(0).toUpperCase() + timeRange.slice(1))} Financial Summary</h3>
        <p><strong>Total Income:</strong> $${income.toFixed(2)}</p>
        <p><strong>Total Tax:</strong> $${tax.toFixed(2)}</p>
        <p><strong>Total Expenses:</strong> $${expenses.toFixed(2)}</p>
        <p><strong>Net Profit:</strong> $${profit.toFixed(2)}</p>
    `;
}

// Calculates financial summary when time range changes
document.getElementById('financeTimePeriod').addEventListener('change', calculateAndDisplayFinancials);
