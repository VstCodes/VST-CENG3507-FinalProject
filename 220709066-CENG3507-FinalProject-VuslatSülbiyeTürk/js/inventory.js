// Gets farmers information from localstorage
function getFarmersFromLocalStorage() {
    const farmers = localStorage.getItem('farmers');
    return farmers ? JSON.parse(farmers) : [];
}

// Gets berries information from localstorage
function getBerriesFromLocalStorage() {
    const berries = localStorage.getItem('berries');
    return berries ? JSON.parse(berries) : [];
}

// Gets package categories from localstorage
function getCategoriesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('categories')) || [];
}

// Gets purchase information from localstorage
function getPurchasesFromLocalStorage() {
    const purchases = localStorage.getItem('purchaseRecords');
    return purchases ? JSON.parse(purchases) : [];
}

// Gets inventory information from localstorage
function getInventoryFromLocalStorage() {
    const inventory = localStorage.getItem("inventory");
    return inventory ? JSON.parse(inventory) : [];
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

// Function for getting raw berry amount
function getRawBerryQuantity(berryId, inventory) {
    // Find the raw berry inventory
    const rawBerryInventory = inventory.filter(i => i.categoryId === 0 && i.berryId === berryId);
    return rawBerryInventory.length > 0 ? rawBerryInventory[0].quantity : 0;
}

// Function for displaying inventory information
function displayInventory() {
    const categories = getCategoriesFromLocalStorage(); 
    const inventory = getInventoryFromLocalStorage(); 
    const berries = getBerriesFromLocalStorage(); 
    const inventoryDiv = document.querySelector('.inventory-div'); 
    inventoryDiv.innerHTML = ''; 

    categories.forEach(category => {
        // If category is premium we ignore that
        if (category.categoryId === 7) return;

        // Category card container
        const inventoryCard = document.createElement('div');
        inventoryCard.classList.add('each-inventory-div'); // Adding class to new div

        const inventoryStock = document.createElement('div');
        inventoryStock.classList.add('each-inventory-div');

        // Filter the inventory items for the current category
        const categoryInventory = inventory.filter(item => item.categoryId === category.categoryId);

        // Initialize inventory details content
        let inventoryDetails = "";

        categoryInventory.forEach(item => {
            const berry = berries.find(b => b.berryId === item.berryId);

            // Check if quantity is 0
            const quantityDisplay = item.quantity === 0 
                ? `<span style="color: red;">No Available Stock</span>` 
                : `${item.quantity}`;

            // Special display for categoryId 0
            if (category.categoryId === 0) {
                inventoryDetails += `
                    <div class="inventory-item">
                        <h4>${berry ? berry.berryName : 'Unknown Berry'}:</h4>
                        <p>Raw Quantity: ${quantityDisplay} kg</p>
                        <p>Storage Location: ${item.storageLocation}</p>
                        <p>Last Updated: ${item.lastUpdated}</p>
                        <p>Reorder Level: ${item.reorderLevel}</p>
                    </div>
                `;
            } else {
                inventoryDetails += `
                    <div class="inventory-item">
                        <h4>${berry ? berry.berryName : 'Unknown Berry'} - ${item.type}</h4>
                        <p>Quantity: ${quantityDisplay} package</p>
                        <p>Storage Location: ${item.storageLocation}</p>
                        <p>Last Updated: ${item.lastUpdated}</p>
                        <p>Reorder Level: ${item.reorderLevel}</p>
                    </div>
                `;
            }
        });

        // If no items in the category inventory
        if (categoryInventory.length === 0) {
            inventoryDetails = `<div class="inventory-item"><p>No Available Stock</p></div>`;
        }

        // Category card content
        inventoryCard.innerHTML = `
            <div class="inventory-name"><h3>${category.categoryName}</h3></div>
            <div class="inventory-informations">
            <h3>Package Details: </h3>
            <p>Weight: ${category.weight ? category.weight + ' ' + category.unit : "Raw Amount"}</p>
            <p>Price per Unit: ${category.pricePerUnit ? '$' + category.pricePerUnit : 'Farmer Price'}</p>
            </div>
        `;
        inventoryStock.innerHTML = `
            <div class="category-inventory-details">${inventoryDetails}</div>
        `;

        // Append category card to inventoryDiv
        inventoryDiv.appendChild(inventoryCard);
        inventoryDiv.appendChild(inventoryStock);
    });
}


// Add event listener to package-btn for display berry info
document.getElementById('inventory-btn').addEventListener('click', () => {
    displayInventory();
    changeSections();
});


// Gets berry name from berries
function getsBerriesNameById(berryId) {
    const berries = getBerriesFromLocalStorage();
    const berry = berries.find(b => b.berryId === berryId);
    return berry ? berry.berryName : 'Unknown Berry';
}

// Function for checking reorder levels
function checkInventoryReorderAlerts() {
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

// Function for the showing reorder alert div
function showInventoryAlerts() {
    const alerts = checkInventoryReorderAlerts();
    const alertDiv = document.getElementById('inventory-alert-info');

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

// Function for calculating sold and remaining invetory
function calculateInventoryAndSales() {
    const sales = getSalesFromLocalStorage();
    const inventory = getInventoryFromLocalStorage();
    let salesSummary = {};
    let inventorySummary = {};

    // Sold amount calcılation
    sales.forEach(sale => {
        let category = sale.categoryId;
        let berry = sale.berryId;

        if (!salesSummary[category]) {
            salesSummary[category] = {};
        }
        if (!salesSummary[category][berry]) {
            salesSummary[category][berry] = 0;
        }
        salesSummary[category][berry] += sale.quantity;
    });

    // Inventory calculation
    inventory.forEach(item => {
        let category = item.categoryId;
        let berry = item.berryId;

        if (!inventorySummary[category]) {
            inventorySummary[category] = {};
        }
        if (!inventorySummary[category][berry]) {
            inventorySummary[category][berry] = 0;
        }
        inventorySummary[category][berry] += item.quantity;
    });

    return { salesSummary, inventorySummary };
}

// Gets category name from categories
function getsCategoryNameByIds(categoryId) {
    const categories = getCategoriesFromLocalStorage();
    const category = categories.find(c => c.categoryId === parseInt(categoryId));
    return category ? category.categoryName : 'Unknown Category';
}

// Gets berries name from berries
function getBerriesNameById(berryId) {
    const berries = getBerriesFromLocalStorage();
    const berry = berries.find(b => b.berryId === parseInt(berryId));
    return berry ? berry.berryName : 'Unknown Berry';
}

// Function for displaying total stock information
function displayInventoryAndSales(data) {
    const { salesSummary, inventorySummary } = data;

    let outputDiv = document.getElementById("inventory-sales-output");
    outputDiv.innerHTML = ""; 
    // Sold amount information
    outputDiv.innerHTML += "<h4>Category Sales:</h4>";
    Object.keys(salesSummary).forEach(category => {
        Object.keys(salesSummary[category]).forEach(berry => {
            if (parseInt(category) === 7) {
                outputDiv.innerHTML += `<p>Package Type ${getsCategoryNameByIds(category)} - Berry ${getBerriesNameById(berry)}: ${salesSummary[category][berry]} kg sold.</p>`;
            } else {
                outputDiv.innerHTML += `<p>Package Type ${getsCategoryNameByIds(category)} - Berry ${getBerriesNameById(berry)}: ${salesSummary[category][berry]} package sold.</p>`;
            }
        });
    });

    // Remainning amount information
    outputDiv.innerHTML += "<h4>Remainning Inventory:</h4>";
    Object.keys(inventorySummary).forEach(category => {
        Object.keys(inventorySummary[category]).forEach(berry => {
            outputDiv.innerHTML += `<p>Package Type ${getsCategoryNameByIds(category)} - Berry ${getBerriesNameById(berry)}: ${inventorySummary[category][berry]} package left.</p>`;
        });
    });
}

// Event listener for calling stock information functions
let isOutputVisible = false;
document.getElementById("calculate-btn").addEventListener("click", () => {
    const outputDiv = document.getElementById("inventory-sales-output");

    if (isOutputVisible) {
        // Closes div
        outputDiv.innerHTML = "";
        isOutputVisible = false;
    } else {
        // Opens div
        const data = calculateInventoryAndSales();
        displayInventoryAndSales(data);
        isOutputVisible = true;
    }
});