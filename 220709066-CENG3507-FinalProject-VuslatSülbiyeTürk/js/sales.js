// Gets berries information from localstorage
function getBerriesFromLocalStorage() {
    const berries = localStorage.getItem('berries');
    return berries ? JSON.parse(berries) : [];
}
// Gets package categories from localstorage
function getCategoriesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('categories')) || [];
}
// Gets sale information from localstorage
function getSalesFromLocalStorage(){
    return JSON.parse(localStorage.getItem('sales')) || [];
}

// Function for controlling cutomer information
function validateCustomerInfo() {
    const customerName = document.getElementById('customer-name').value.trim();
    const contact = document.getElementById('customer-contact').value.trim();
    const shippingAddress = document.getElementById('customer-address').value.trim();

    const nameRegex = /^[A-Za-z\s]+$/; // Only letters and space
    const contactRegex = /^\d{11}$/; // 11 digit numbers

    // Customer name control
    if (!customerName || !nameRegex.test(customerName)) {
        alert('Customer Name must only contain letters and spaces, and it cannot be empty.');
        return false;
    }

    // Customer contact control
    if (!contact || !contactRegex.test(contact)) {
        alert('Contact must be exactly 11 digits and contain only numbers.');
        return false;
    }

    // Sipping address control
    if (!shippingAddress) {
        alert('Shipping Address cannot be empty.');
        return false;
    }
    return true;
}

document.getElementById('clear-customer-form').addEventListener('click', () => {
    // Cleans input places
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-contact').value = '';
    document.getElementById('customer-address').value = '';
});


// Function for displaying categories
function displayCategories() {
    const categories = getCategoriesFromLocalStorage(); // Gets category data from localStorage
    const categoryDiv = document.querySelector('.category-sales-div'); // Main container for categories
    categoryDiv.innerHTML = ''; // Clear existing content

    categories.forEach(category => {
        // dont display "Raw" category
        if (category.categoryId === 0) return;

        // Category card container
        const categoryCard = document.createElement('div');
        categoryCard.classList.add('each-category-sales-div'); // Adding class to new div

        // Category card content
        categoryCard.innerHTML = `
            <div class="category-name"><h3>${category.categoryName}</h3></div>
            <button onclick="showCategoryDetails(${category.categoryId})" class="category-div-btn">Details</button>
            <button onclick="showOrderDetails(${category.categoryId})" class="category-div-btn">Manage</button>
        `;

        // Category detail div
        const categoryDetailDiv = document.createElement('div');
        categoryDetailDiv.className = 'category-detail-div';
        categoryDetailDiv.style.display = 'none'; // Hidden by default
        categoryDetailDiv.id = `category-detail-${category.categoryId}`; // Unique ID using categoryId

        // Category management div
        const categoryManageDiv = document.createElement('div');
        categoryManageDiv.className = 'order-detail-div';
        categoryManageDiv.style.display = 'none'; // Hidden by default
        categoryManageDiv.id = `order-detail-${category.categoryId}`; // Unique ID using categoryId

        // Append category card and related divs
        categoryDiv.appendChild(categoryCard);
        categoryDiv.appendChild(categoryDetailDiv);
        categoryDiv.appendChild(categoryManageDiv);
    });
}

// Add event listener to sales-btn for display category info
document.getElementById('sales-btn').addEventListener('click', () => {
    displayCategories();
    changeSections();
});

// Function to show category details
function showCategoryDetails(categoryId) {
    const categories = getCategoriesFromLocalStorage();
    const category = categories.find(cat => cat.categoryId === categoryId);

    if (!category) return;

    const categoryDetailDiv = document.getElementById(`category-detail-${categoryId}`);

    if (categoryDetailDiv.style.display === 'none') {
        categoryDetailDiv.style.display = 'block';
        categoryDetailDiv.innerHTML = `
            <h3>${category.categoryName} Package Type Details</h3>
            <br>
            <p>Weight: ${category.weight ? category.weight + ' ' + category.unit : 'Premium Order'}</p>
            <p>Price per Unit: ${category.pricePerUnit ? '$' + category.pricePerUnit : 'Premium Order Price'}</p>
        `;
    } else {
        categoryDetailDiv.style.display = 'none';
    }
}

// Function for showing order div and details
function showOrderDetails(categoryId) {
    const categories = getCategoriesFromLocalStorage();
    const inventory = getInventoryFromLocalStorage();
    const berries = getBerriesFromLocalStorage();
    const category = categories.find(cat => cat.categoryId === categoryId);

    if (!category) return;

    const orderDetailDiv = document.getElementById(`order-detail-${categoryId}`);

    if (orderDetailDiv.style.display === 'none') {
        // Controls customer info
        if (!validateCustomerInfo()) {
            return;  // If customer info not full stop the function
        }

        orderDetailDiv.style.display = 'block';

        let orderContent = `<h4>Order Details for ${category.categoryName}</h4>`;

        // For premium category
        if (categoryId === 7) {
            orderContent += `<h5>Premium Berries</h5>`;
            const stockForPremium = inventory.filter(item => item.categoryId === 0); // Raw stock information

            if (stockForPremium.length > 0) {
                stockForPremium.forEach(stock => {
                    const berry = berries.find(b => b.berryId === stock.berryId);
                    orderContent += `
                        <div>
                            <p>${berry.berryName} (${stock.type}):</p>
                            <p>Raw Quantity: ${stock.quantity} ${stock.unit}</p>
                            
                            <!-- Quantity Input -->
                            <label for="order-quantity-${stock.berryId}">Enter Quantity:</label>
                            <input type="number" id="order-quantity-${stock.berryId}" 
                                   min="1" max="${stock.quantity}" 
                                   placeholder="Enter quantity">
                            <br>
                            <!-- Kilogram Input -->
                            <label for="order-kg-${stock.berryId}">Enter Amount You Choose:</label>
                            <input type="number" id="order-kg-${stock.berryId}" 
                                   min="0.1" step="0.1" 
                                   placeholder="Enter kg">
                        </div>
                        <br>
                    `;
                });
            } else {
                orderContent += `<p>No raw stock available for premium berries.</p> <br>`;
            }
        } else {
            // For other categories
            const stockForCategory = inventory.filter(item => item.categoryId === categoryId);

            if (stockForCategory.length > 0) {
                stockForCategory.forEach(stock => {
                    const berry = berries.find(b => b.berryId === stock.berryId);
                    orderContent += `
                        <div>
                            <br>
                            <p>${berry.berryName}:</p>
                            <p>Available Quantity: ${stock.quantity} ${stock.unit}</p>
                            <label for="order-quantity-${stock.berryId}">Order Quantity:</label>
                            <input type="number" id="order-quantity-${stock.berryId}" 
                                   min="1" max="${stock.quantity}" 
                                   placeholder="Enter amount">
                        </div>
                    `;
                });
            } else {
                orderContent += `<p>No stock available for this category.</p> <br>`;
            }
        }

        orderContent += `
            <button onclick="submitOrder(${categoryId})" class="sc-btn">Submit Order</button>
            <button onclick="cancelOrder(${categoryId})" class="sc-btn">Cancel</button>
        `;

        orderDetailDiv.innerHTML = orderContent;
    } else {
        orderDetailDiv.style.display = 'none';
    }
}

// Function for getting berry price per unit
function getBerryPrice(berryId) {
    berries = getBerriesFromLocalStorage();
    // Find related berry
    const berry = berries.find(b => b.berryId === berryId);
    return berry.pricePerKg;
}

// Function for saving orders
function submitOrder(categoryId) {
    const customerName = document.getElementById('customer-name').value.trim();
    const customerContact = document.getElementById('customer-contact').value.trim();
    const shippingAddress = document.getElementById('customer-address').value.trim();

    if (!customerName || !/^[a-zA-Z\s]+$/.test(customerName)) {
        alert('Please enter a valid customer name (letters and spaces only).');
        return;
    }
    if (!customerContact || !/^\d{11}$/.test(customerContact)) {
        alert('Please enter a valid 11-digit contact number.');
        return;
    }
    if (!shippingAddress) {
        alert('Please enter a valid shipping address.');
        return;
    }

    let sales = getSalesFromLocalStorage();
    const inventory = getInventoryFromLocalStorage();
    const categories = getCategoriesFromLocalStorage();
    const category = categories.find(cat => cat.categoryId === categoryId);

    if (!category) {
        alert('Invalid category.');
        return;
    }

    // Gets stock based on categoryId logic
    let stockForCategory;
    if (categoryId === 7) {
        stockForCategory = inventory.filter(item => item.categoryId === 0); // Use categoryId 0 stock for categoryId 7
    } else {
        stockForCategory = inventory.filter(item => item.categoryId === categoryId);
    }

    const validationResults = []; // Holds validation results for each berry

    stockForCategory.forEach(stock => {
        const berryId = stock.berryId;
        const berryQuantityInput = document.getElementById(`order-quantity-${berryId}`);
        const berryKgInput = document.getElementById(`order-kg-${berryId}`); // For categoryId 7

        if (categoryId === 7 && berryQuantityInput && berryKgInput) {
            const quantity = parseInt(berryQuantityInput.value);
            const kg = parseFloat(berryKgInput.value);

            if (!isNaN(quantity) && quantity > 0 && !isNaN(kg) && kg > 0) {
                const totalKgUsed = quantity * kg;

                if (totalKgUsed <= stock.quantity) {
                    validationResults.push(true); // Valid order

                    const pricePerUnit = getBerryPrice(berryId);
                    const totalPrice = pricePerUnit * totalKgUsed;

                    const newSale = {
                        orderId: sales.length + 1,
                        customerName,
                        customerContact,
                        shippingAddress,
                        categoryId, // Original categoryId
                        berryId,
                        quantity,
                        kg,
                        totalPrice,
                        usedCategoryId: 0, // Tracks which stock was used
                        orderStatus: 'Ready',
                        date: new Date().toLocaleDateString('en-GB'),
                        kdv: (totalPrice / 100)
                    };
                    sales.push(newSale);

                    stock.quantity -= totalKgUsed;
                } else {
                    alert(`Insufficient stock for ${stock.berryId}. Available: ${stock.quantity} kg.`);
                    validationResults.push(false);
                }
            } else {
                validationResults.push(false);
            }
        } else if (berryQuantityInput) {
            const quantity = parseInt(berryQuantityInput.value);
            if (!isNaN(quantity) && quantity > 0 && quantity <= stock.quantity) {
                validationResults.push(true); // Valid order

                const pricePerUnit = category.pricePerUnit;
                const totalPrice = pricePerUnit * quantity;

                const newSale = {
                    orderId: sales.length + 1,
                    customerName,
                    customerContact,
                    shippingAddress,
                    categoryId,
                    berryId,
                    quantity,
                    totalPrice,
                    orderStatus: 'Ready',
                    date: new Date().toLocaleDateString('en-GB'),
                    kdv: (totalPrice / 100)
                };
                sales.push(newSale);

                stock.quantity -= quantity;
            } else {
                validationResults.push(false);
            }
        }
    });

    // Final validation check
    if (!validationResults.some(result => result === true)) {
        alert(categoryId === 7
            ? 'Please enter valid kg and quantity for at least one berry.'
            : 'Please enter a valid order quantity for at least one berry.');
        return;
    }

    localStorage.setItem('sales', JSON.stringify(sales));
    localStorage.setItem('inventory', JSON.stringify(inventory));

    alert('Order submitted successfully!');

    const orderDetailDiv = document.getElementById(`order-detail-${categoryId}`);
    if (orderDetailDiv) {
        orderDetailDiv.style.display = 'none';
    }
}

// Function for closing order div
function cancelOrder(categoryId) {
    document.getElementById(`order-detail-${categoryId}`).style.display = 'none';
}

// Function to filter and render sales depending on search input
function filterSales() {
    const searchInput = document.getElementById("sales-search-input").value.toLowerCase();
    const sales = getSalesFromLocalStorage();

    const filteredSales = sales.filter(sale =>
        Object.values(sale).some(value =>
            String(value).toLowerCase().includes(searchInput))
    );
    renderSalesTable(filteredSales);
}

// Function to render sales table by search input
function renderSalesTable(sales) {
    const salesTable = document.getElementById("sales-records-table");
    salesTable.innerHTML = ""; // Clear the table

    if (sales.length > 0) {
        // Create table header
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `
            <th>Customer Name</th>
            <th>Contact</th>
            <th>Shipping Address</th>
            <th>Berry Type</th>
            <th>Package Type</th>
            <th>Weight Per Package</th>
            <th>Quantity</th>
            <th>Total Amount</th>
            <th>Price Per Package</th>
            <th>Total Price</th>
            <th>Order Status</th>
            <th>Date</th>
        `;
        salesTable.appendChild(headerRow);

        let totalRevenue = 0; // Variable to store the total revenue

        // Add sales rows
        sales.forEach(sale => {
            const berries = getBerriesFromLocalStorage(); 
            const berry = berries.find(b => b.berryId === sale.berryId);
            const saleRow = document.createElement("tr");
            saleRow.innerHTML = `
                <td>${sale.customerName}</td>
                <td>${sale.customerContact}</td>
                <td>${sale.shippingAddress}</td>
                <td>${berry.berryName}</td>
                <td>${getCategoryNameById(sale.categoryId)}</td>
                <td>${getPackageWeight(sale)}</td>
                <td>${sale.quantity}</td>
                <td>${calculateTotalAmount(sale)}</td>
                <td>$${getPackagePrice(sale)}</td>
                <td>$${sale.totalPrice.toFixed(2)}</td>
                <td>${sale.orderStatus}</td>
                <td>${sale.date}</td>
            `;
            salesTable.appendChild(saleRow);

            // Add to total revenue
            totalRevenue += sale.totalPrice;
        });

        // Add total revenue row at the end of the table
        const totalRow = document.createElement("tr");
        totalRow.innerHTML = `
            <td colspan="6" style="text-align: right; font-weight: bold;">Total Revenue:</td>
            <td colspan="3">$${totalRevenue.toFixed(2)}</td>
        `;
        salesTable.appendChild(totalRow);

    } else {
        // No sales match
        const noSalesRow = document.createElement("tr");
        noSalesRow.innerHTML = `<td colspan="9">No sales match your search.</td>`;
        salesTable.appendChild(noSalesRow);
    }
}

// Initial rendering of sales table
document.addEventListener("DOMContentLoaded", () => {
    renderSalesTable(sales); // Render all sales on page load
});

// Function for calculation of total amount sold
function calculateTotalAmount(sale) {
    categories_ = getCategoriesFromLocalStorage();
    // Find related category
    const category = categories_.find(c => c.categoryId === sale.categoryId);

    if (category.categoryId === 7) {
        return sale.quantity * sale.kg;
    }else{
        return sale.quantity * category.weight;
    }
}

// Function for getting weigth per package
function getPackageWeight(sale) {
    categories_ = getCategoriesFromLocalStorage();
    // Find related category
    const category = categories_.find(c => c.categoryId === sale.categoryId);

    if (category.categoryId === 7) {
        return sale.kg;
    }else{
        return category.weight;
    }
}

// Function for getting price per package
function getPackagePrice(sale) {
    categories_ = getCategoriesFromLocalStorage();
    berries = getBerriesFromLocalStorage();
    // Find related category
    const category = categories_.find(c => c.categoryId === sale.categoryId);
    const berry = berries.find(b => b.berryId === sale.berryId);

    if (category.categoryId === 7) {
        return sale.kg * berry.pricePerKg;
    }else{
        return category.pricePerUnit;
    }
}

// Gets category name from categories
function getCategoryNameById(categoryId) {
    const categories = getCategoriesFromLocalStorage();
    const category = categories.find(c => c.categoryId === categoryId);
    return category ? category.categoryName : 'Unknown Category';
}

// Function for showing sale records
function showSalesRecords() {
    const sales = getSalesFromLocalStorage(); // Get sales from localStorage
    const berries = getBerriesFromLocalStorage(); // Get berries from localStorage

    const popupDiv = document.getElementById("popup-sales-records-div");
    const salesTable = document.getElementById("sales-records-table");

    // Clear the previous content of the table
    salesTable.innerHTML = "";

    // Get the selected time range
    const timeRange = document.getElementById("time-range").value;

    // Filter the sales based on the selected time range
    const filteredSales = filterSalesByTimeRange(sales, timeRange);

    if (filteredSales.length > 0) {
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `
            <th>Customer Name</th>
            <th>Contact</th>
            <th>Shipping Address</th>
            <th>Berry Type</th>
            <th>Package Type</th>
            <th>Weight Per Package</th>
            <th>Quantity</th>
            <th>Total Amount</th>
            <th>Price Per Package</th>
            <th>Total Price</th>
            <th>Order Status</th>
            <th>Date</th>
        `;
        salesTable.appendChild(headerRow);

        // Loop through filtered sales and create rows for the table
        filteredSales.forEach(sale => {
            const berry = berries.find(b => b.berryId === sale.berryId); // Find the corresponding berry for the sale
            const salesRow = document.createElement("tr");
            salesRow.innerHTML = `
                <td>${sale.customerName}</td>
                <td>${sale.customerContact}</td>
                <td>${sale.shippingAddress}</td>
                <td>${berry.berryName}</td>
                <td>${getCategoryNameById(sale.categoryId)}</td>
                <td>${getPackageWeight(sale)}</td>
                <td>${sale.quantity}</td>
                <td>${calculateTotalAmount(sale)}</td>
                <td>$${getPackagePrice(sale)}</td>
                <td>$${sale.totalPrice.toFixed(2)}</td>
                <td>${sale.orderStatus}</td>
                <td>${sale.date}</td>
            `;
            salesTable.appendChild(salesRow);
        });

    } else {
        // Display a message if no sales records match the time range
        const noSalesRecords = document.createElement("tr");
        noSalesRecords.innerHTML = `<td colspan="9">There are no sales records for the selected time range.</td>`;
        salesTable.appendChild(noSalesRecords);
    }

    // Ensure the popup is visible
    popupDiv.style.display = "block";
}

// Function for closing sales records div
function closeSalesRecords() {
    const popupDiv = document.querySelector('#popup-sales-records-div');
    popupDiv.style.display = "none";
}

// Function for filtereng sales by time range
function filterSalesByTimeRange(sales, timeRange) {
    const today = new Date();
    let startDate, endDate;

    // Helper function to parse DD/MM/YYYY format
    function parseDate(dateStr) {
        const [day, month, year] = dateStr.split("/").map(Number);
        return new Date(year, month - 1, day); 
    }

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

    // Filter sales
    return sales.filter(sale => {
        const saleDate = parseDate(sale.date); // Parse date from DD/MM/YYYY
        if (startDate && endDate) {
            return saleDate >= startDate && saleDate < endDate;
        }
        return true; // Show all records if no range is defined
    });
}

// Shows sales by time range
function updateSalesRecords() {
    const timeRange = document.getElementById("sales-time-range").value; // Takes time range
    const sales = getSalesFromLocalStorage(); 

    // Filters sales by time arnge
    const filteredSales = filterSalesByTimeRange(sales, timeRange); 

    // Calls the function for displaying sales by time range
    renderSalesTable(filteredSales);
}
