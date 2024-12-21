// Gets berries information from localstorage
function getBerriesFromLocalStorage() {
    const berries = localStorage.getItem('berries');
    return berries ? JSON.parse(berries) : [];
}
// Gets package categories from localstorage
function getCategoriesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('categories')) || [];
}
// Gets inventory information from localstorage
function getInventoryFromLocalStorage() {
    const inventory = localStorage.getItem("inventory");
    return inventory ? JSON.parse(inventory) : [];
}
// Gets sales information from localstorage
function getSalesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('sales')) || [];
}
// Gets packaging information from locastorage
function getPackageReportsFromLocalStorage(){
    return JSON.parse(localStorage.getItem('packageReports')) || [];
}


// Function for changing navigation sections
function changeSections() {
    document.querySelector('nav').addEventListener('click', (event) => {
        if (event.target.classList.contains('nav-btn')) { // Checks navigation buttons are clicked
            const sectionId = event.target.id.replace('-btn', ''); // Takes section id from button id
            const targetSection = document.getElementById(sectionId); // Selects target section

            // Hides all sections
            document.querySelectorAll('section').forEach(section => section.classList.add('hidden'));

            // Shows target section
            if (targetSection) {
                targetSection.classList.remove('hidden');
                console.log("secion changed");
            }
        }
    });
}

// Function for displaying all berry types
function displayBerries() {
    const berries = getBerriesFromLocalStorage(); // Gets berry data from localStorage
    const berryDiv = document.querySelector('.berry-div'); // Main container for berries
    berryDiv.innerHTML = ''; // Clear existing content

    berries.forEach(berry => {
        // Berry card container
        const berryCard = document.createElement('div');
        berryCard.classList.add('each-berry-div'); // Adding class to new div

        // Berry card content
        berryCard.innerHTML = `
            <div class="berry-name"><h3>${berry.berryName}</h3></div>
            <button onclick="showBerryDetails(${berry.berryId})" class="berry-div-btn">Details</button>
            <button onclick="packageBerry(${berry.berryId})" class="berry-div-btn">Package</button>
            <button onclick="showUpdateDiv(${berry.berryId})" class="berry-div-btn">Update</button>
            <button onclick="showTrendsDiv(${berry.berryId})" class="berry-div-btn">Trends</button>
       `;

        // Berry detail div
        const berryDetailDiv = document.createElement('div');
        berryDetailDiv.className = 'berry-detail-div';
        berryDetailDiv.style.display = 'none'; // Hidden by default
        berryDetailDiv.id = `berry-detail-${berry.berryId}`; // Unique ID using berryId

        // Berry package div
        const berryPackageDiv = document.createElement('div');
        berryPackageDiv.className = 'berry-package-div';
        berryPackageDiv.style.display = 'none'; // Hidden by default
        berryPackageDiv.id = `berry-package-${berry.berryId}`; // Unique ID using berryId

        // Package update div
        const updateDiv = document.createElement('div');
        updateDiv.className = 'update-packaging';
        updateDiv.style.display = 'none'; // Hidden by default
        updateDiv.id = `berry-update-${berry.berryId}`; // Unique ID using berryId

        // Trends div
        const trendsDiv = document.createElement('div');
        trendsDiv.className = 'berry-trends-div';
        trendsDiv.style.display = 'none'; // Hidden by default
        trendsDiv.id = `berry-trends-${berry.berryId}`; // Unique ID using berryId

        // Append berry card and detail div
        berryDiv.appendChild(berryCard);
        berryDiv.appendChild(berryDetailDiv);
        berryDiv.appendChild(berryPackageDiv);
        berryDiv.appendChild(updateDiv);
        berryDiv.appendChild(trendsDiv);
    });
}

// Add event listener to package-btn for display berry info
document.getElementById('package-btn').addEventListener('click', () => {
    displayBerries();
    changeSections();
});

// Function for get inventory information for each berry type
function getBerryInventoryDetails(berryId, inventory) {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const berryItems = inventory.filter(item => item.berryId === berryId);

    if (berryItems.length === 0) {
        return "No inventory data available for this berry.";
    }

    // Create a list of inventory details
    let inventoryDetails = `<ul>`;
    berryItems.forEach(item => {
        const category = categories.find(cat => cat.categoryId === item.categoryId);
        const categoryName = category ? category.categoryName : "Unknown";
        const weightPerUnit = category ? category.weight : 0;  
        const totalAmount = item.quantity * weightPerUnit; 
        const storageLocation = item.type === "raw"
            ? `TRB${item.berryId}`
            : `T${item.categoryId}B${item.berryId}`;

        if (item.type === "raw") {
            inventoryDetails += `
                <li>
                    <strong>Type:</strong> ${item.type}<br>
                    <strong>Total Amount:</strong> ${item.quantity} kg<br>
                    <strong>Storage Location:</strong> ${storageLocation}<br>
                    <strong>Last Updated:</strong> ${item.lastUpdated}<br>
                    <br>
                    <hr>
                    <br>
                </li>`;
        } else {
            inventoryDetails += `
                <li>
                    <strong>Type:</strong> ${item.type}<br>
                    <strong>Category:</strong> ${categoryName}<br>
                    <strong>Quantity:</strong> ${item.quantity}<br>
                    <strong>Total Amount:</strong> ${totalAmount} kg<br>
                    <strong>Storage Location:</strong> ${storageLocation}<br>
                    <strong>Last Updated:</strong> ${item.lastUpdated}<br>
                    <br>
                    <hr>
                    <br>
                </li>`;
        }
    });
    inventoryDetails += `</ul>`;

    return inventoryDetails;
}

// Function for showing berry details for each berry type
function showBerryDetails(berryId) {
    const berryDetailDiv = document.getElementById(`berry-detail-${berryId}`);
    const berries = getBerriesFromLocalStorage();
    const inventory = getInventoryFromLocalStorage();

    // Find the berry with the matching berryId
    const berry = berries.find(b => b.berryId === berryId);

    const berryName = berry.berryName;
    const berryInventoryDetails = getBerryInventoryDetails(berryId, inventory);

    // Show berry details
    if (berryDetailDiv.style.display === "none" || berryDetailDiv.style.display === "") {
        berryDetailDiv.style.display = "block";
        berryDetailDiv.innerHTML = `
            <div class="berry-detail-div">
                <h3><u>~Berry Details for ${berryName}~</u></h3>
                <p><strong>Berry Name:</strong> ${berryName}</p>
                <p><strong>Berry Inventory:</strong> ${berryInventoryDetails}</p>
                <br>
            </div>
            <button type="button" onclick="hideBerryDetails(${berryId})" class="sc-btn">Close</button>
        `;
    } else {
        berryDetailDiv.style.display = "none";
    }
}

// Function to hide the berry details div
function hideBerryDetails(berryId) {
    const berryDetailDiv = document.getElementById(`berry-detail-${berryId}`);
    berryDetailDiv.style.display = "none";
}

// Function for showing berry packaging div
function packageBerry(berryId) {
    const berryPackageDiv = document.getElementById(`berry-package-${berryId}`);
    const berries = getBerriesFromLocalStorage();
    const inventory = getInventoryFromLocalStorage();

    // Find the selected berry
    const berry = berries.find(b => b.berryId === berryId);

    // Find the raw inventory for the selected berry
    const rawInventory = inventory.find(inv => inv.berryId === berryId && inv.categoryId === 0);
    const rawQuantity = rawInventory ? rawInventory.quantity : 0;

    if (berryPackageDiv.style.display === "none" || berryPackageDiv.style.display === "") {
        berryPackageDiv.style.display = "block";

        // Lists raw quantity and creates a form for each packaging type
        let packageForm = `
            <div class="berry-package-div">
                <h3>Package ${berry.berryName}</h3>
                <p><strong>Available Raw Quantity:</strong> ${rawQuantity} kg</p>
        `;

        // Creates input fields for each packaging type
        const categories = getCategoriesFromLocalStorage();
        categories
            .filter(cat => cat.categoryId > 0 && cat.categoryId !== 7)
            .forEach(category => {
                packageForm += `
                    <div class="package-item">
                        <label>${category.categoryName} (${category.weight}kg):</label>
                        <input type="number" min="0" value="0" id="package-quantity-${berryId}-${category.categoryId}" />
                    </div>
                `;
            });

        // Add a single package button at the end
        packageForm += `
            </div>
            <button type="button" onclick="savePackageAll(${berryId}, ${rawQuantity})" class="sc-btn">Package</button>
            <button type="button" onclick="hideBerryPackageDiv(${berryId})" class="sc-btn">Close</button>
        `;

        // Adds package form inside the div
        berryPackageDiv.innerHTML = packageForm;
    } else {
        berryPackageDiv.style.display = "none";
    }
}

// Function for hiding packaging div
function hideBerryPackageDiv(berryId) {
    const berryPackageDiv = document.getElementById(`berry-package-${berryId}`);
    berryPackageDiv.style.display = "none";
}

// Function for saving packaging information
function savePackageAll(berryId, rawQuantity) {
    const categories = getCategoriesFromLocalStorage();
    const inventory = getInventoryFromLocalStorage();
    let packageReports = getPackageReportsFromLocalStorage();

    // Calculate total quantity from input fields
    let totalQuantity = 0;
    const packageData = [];

    categories
        .filter(cat => cat.categoryId > 0 && cat.categoryId !== 7)
        .forEach(category => {
            const input = document.getElementById(`package-quantity-${berryId}-${category.categoryId}`);
            const quantity = parseFloat(input.value) || 0;

            if (quantity > 0) {
                totalQuantity += quantity * category.weight;
                packageData.push({ categoryId: category.categoryId, quantity });
            }
        });

    if (totalQuantity > rawQuantity) {
        alert("You cannot package more than the available raw quantity!");
        return;
    }

    // Update inventory
    const rawInventory = inventory.find(inv => inv.berryId === berryId && inv.categoryId === 0);
    if (rawInventory) {
        rawInventory.quantity -= totalQuantity;
    }

    packageData.forEach(data => {
        const packageInventory = inventory.find(inv => inv.berryId === berryId && inv.categoryId === data.categoryId);
        if (packageInventory) {
            packageInventory.quantity += data.quantity;
        } else {
            inventory.push({
                inventoryId: inventory.length + 1,
                berryId: berryId,
                type: "packaged",
                categoryId: data.categoryId,
                quantity: data.quantity,
                unit: "kg",
                storageLocation: `T${data.categoryId}B${berryId}`,
                lastUpdated: new Date().toLocaleDateString('en-GB'),
                reorderLevel: 100
            });
        }
        // Add data to packageReports
        packageReports.push({
            packagingId: packageReports.length + 1,
            berryId: berryId,
            categoryId: data.categoryId,
            quantity: data.quantity,
            unit: "kg",
            storageLocation: `T${data.categoryId}B${berryId}`,
            date: new Date().toLocaleDateString('en-GB')
        });
    });

    // Save updated inventory and reports to localStorage
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('packageReports', JSON.stringify(packageReports));

    alert("Packaging successful!");
    hideBerryPackageDiv(berryId);
}

// Function for showing package price update div
function showUpdateDiv(berryId) {
    const updateDiv = document.getElementById(`berry-update-${berryId}`);
    const categories = JSON.parse(localStorage.getItem('categories')) || [];

    if (updateDiv.style.display === "none" || updateDiv.style.display === "") {
        updateDiv.style.display = "block";

        let updateForm = `<h3><strong>~ Update Categories ~</strong></h3>`;

        categories.forEach(category => {
            if (category.categoryId > 0 && category.categoryId !== 7) { // Except raw and premium types
                updateForm += `
                    <br>
                    <div class="update-packaging">
                        <label>${category.categoryName}:</label><br>
                        <label>Weight (kg/unit):</label>
                        <input type="number" min="0.1" step="0.1" id="update-weight-${berryId}-${category.categoryId}" value="${category.weight || ''}" /><br>
                        <label>Price Per Unit:</label>
                        <input type="number" min="0.01" step="0.01" id="update-price-${berryId}-${category.categoryId}" value="${category.pricePerUnit || ''}" /><br>
                    </div>
                `;
            }
        });

        updateForm += `
            <button type="button" onclick="saveUpdatedCategories(${berryId})" class="sc-btn">Save</button>
            <button type="button" onclick="hideUpdateDiv(${berryId})" class="sc-btn">Close</button>
        `;

        updateDiv.innerHTML = updateForm;
    } else {
        updateDiv.style.display = "none";
    }
}

// Function for saving updated package prices
function saveUpdatedCategories(berryId) {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    let isValid = true;
    let errorMessage = "";

    categories.forEach(category => {
        if (category.categoryId > 0 && category.categoryId !== 7) { // Except raw and premium types
            const weightInput = document.getElementById(`update-weight-${berryId}-${category.categoryId}`);
            const priceInput = document.getElementById(`update-price-${berryId}-${category.categoryId}`);

            const weight = parseFloat(weightInput.value);
            const price = parseFloat(priceInput.value);

            if (isNaN(weight) || weight <= 0) {
                isValid = false;
                errorMessage += `Invalid weight for category: ${category.categoryName}. Please enter a positive number.\n`;
            }
            if (isNaN(price) || price <= 0) {
                isValid = false;
                errorMessage += `Invalid price for category: ${category.categoryName}. Please enter a positive number.\n`;
            }

            if (isValid) {
                category.weight = weight;
                category.pricePerUnit = price;
            }
        }
    });
    if (!isValid) {
        alert(errorMessage);
        return;
    }
    localStorage.setItem('categories', JSON.stringify(categories));
    alert("Categories updated successfully!");
}

// Function for hiding packaging price update div
function hideUpdateDiv(berryId) {
    const updateDiv = document.getElementById(`berry-update-${berryId}`);
    updateDiv.style.display = "none";
}

// Function for checking reorder levels
function checkReorderAlerts() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const categories = JSON.parse(localStorage.getItem('categories')) || [];

    let alerts = [];

    inventory.forEach(item => {
        if (item.quantity <= item.reorderLevel) {
            const category = categories.find(cat => cat.categoryId === item.categoryId);
            const categoryName = category ? category.categoryName : "Unknown";
            alerts.push(`Warning: Low inventory for ${categoryName} Type - ${getsBerriesNameById(item.berryId)} -> Quantity: ${item.quantity}`);
        }
    });

    return alerts;
}

// Gets berry name from berries
function getsBerriesNameById(berryId) {
    const berries = getBerriesFromLocalStorage();
    const berry = berries.find(b => b.berryId === berryId);
    return berry ? berry.berryName : 'Unknown Berry';
}

// Function for the showing reorder alert div
function showAlerts() {
    const alerts = checkReorderAlerts();
    const alertDiv = document.getElementById('alert-info');

    if (alertDiv.style.display === "block") {
        alertDiv.style.display = "none";
        return;
    }

    if (alerts.length > 0) {
        alertDiv.innerHTML = `<h3>Alerts:</h3><ul>` +
            alerts.map(alert => `<li>${alert}</li>`).join('') +
            `</ul>`;
    } else {
        alertDiv.innerHTML = "<h3>All systems normal: No alerts.</h3>";
    }

    alertDiv.style.display = "block";
}

// Function for showing trends div for each berry type
function showTrendsDiv(berryId) {
    const trendsDiv = document.getElementById(`berry-trends-${berryId}`);
    const sales = getSalesFromLocalStorage();
    const categories = getCategoriesFromLocalStorage();

    if (trendsDiv.style.display === "none" || trendsDiv.style.display === "") {
        trendsDiv.style.display = "block";

        // Takes sales for berryId
        const berrySales = sales.filter(sale => sale.berryId === berryId);

        // If there is no sale for the berry
        if (berrySales.length === 0) {
            trendsDiv.innerHTML = `<h3>TRENDS:</h3><p>No sales data available for this berry.</p>`;
            return;
        }

        // Takes total sales for each category
        const categorySales = {};

        berrySales.forEach(sale => {
            const categoryId = sale.categoryId;
            if (!categorySales[categoryId]) {
                categorySales[categoryId] = 0;
            }
            categorySales[categoryId] += sale.quantity; // Adds sales for categories
        });

        // Sorts categories by sales
        const sortedCategories = Object.entries(categorySales)
            .sort(([, qtyA], [, qtyB]) => qtyB - qtyA); // Sorts by sale amount
            

        // Trends div content
        let trendsContent = `<h3>TRENDS:</h3><ul>`;
        sortedCategories.forEach(([categoryId, quantity], index) => {
            const category = categories.find(cat => cat.categoryId === parseInt(categoryId));
            const categoryName = category ? category.categoryName : "Unknown";
            const discountSuggestion = quantity > 500 ? "Consider a discount!" : "No discount needed.";

            trendsContent += `
                <div class="berry-detail-div">
                    <li>
                        <strong>#${index + 1} - ${categoryName}</strong><br>
                        <strong>Quantity Sold:</strong> ${quantity}<br>
                        <strong>Discount Suggestion:</strong> ${discountSuggestion}<br>
                    </li>
                    <br>
                </div>
            `;
        });

        trendsContent += `</ul>`;
        trendsContent += `
            <button type="button" onclick="hideTrendsDiv(${berryId})" class="sc-btn">Close</button>
        `;
        trendsDiv.innerHTML = trendsContent;
    } else {
        trendsDiv.style.display = "none";
    }
}

// Function for hiding trends div
function hideTrendsDiv(berryId) {
    const trendsDiv = document.getElementById(`berry-trends-${berryId}`);
    trendsDiv.style.display = "none";
}
