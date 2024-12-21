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

// Function for displaying farmers informations
function displayFarmers() {
    const farmers = getFarmersFromLocalStorage(); // Gets farmer data from localStorage
    const farmerDiv = document.querySelector('.farmer-div'); // Main container for farmers
    farmerDiv.innerHTML = ''; // Clear existing content

    farmers.forEach(farmer => {
        // Farmer card container
        const farmerCard = document.createElement('div');
        farmerCard.classList.add('each-farmer-div'); // Adding class to new div

        // Farmer card content
        farmerCard.innerHTML = `
            <div class="farmer-name"><h3>${farmer.farmerFName} ${farmer.farmerLName}</h3></div>
            <button onclick="showFarmerDetails(${farmer.farmerId})" class="farmer-div-btn">Details</button>
            <button onclick="editFarmer(${farmer.farmerId})" class="farmer-div-btn">Edit</button>
            <button onclick="purchaseFromFarmer(${farmer.farmerId})" class="farmer-div-btn">Purchase</button>
            <button onclick="deleteFarmer(${farmer.farmerId})" class="farmer-div-btn">Remove</button>
        `;

        // Farmer detail div
        const farmerDetailDiv = document.createElement('div');
        farmerDetailDiv.className = 'farmer-detail-div';
        farmerDetailDiv.style.display = 'none'; // Hidden by default
        farmerDetailDiv.id = `farmer-detail-${farmer.farmerId}`; // Unique ID using farmerId

        // Farmer edit div
        const farmerEditDiv = document.createElement('div');
        farmerEditDiv.className = 'farmer-edit-div';
        farmerEditDiv.style.display = 'none'; // Hidden by default
        farmerEditDiv.id = `farmer-edit-${farmer.farmerId}`; // Unique ID using farmerId

        // Farmer purchase div
        const farmerPurchaseDiv = document.createElement('div');
        farmerPurchaseDiv.className = 'farmer-purchase-div';
        farmerPurchaseDiv.style.display = 'none';
        farmerPurchaseDiv.id = `farmer-purchase-${farmer.farmerId}`;

        // Append farmer card and detail div
        farmerDiv.appendChild(farmerCard);
        farmerDiv.appendChild(farmerDetailDiv);
        farmerDiv.appendChild(farmerEditDiv);
        farmerDiv.appendChild(farmerPurchaseDiv);
    });
}

// Add event listener to farmer-btn for display farmer info
document.getElementById('farmer-btn').addEventListener('click', () => {
    displayFarmers();
    changeSections();
});

document.addEventListener("DOMContentLoaded", function () {
    // Load farmer section div when page first loaded
    displayFarmers();
});


// Function for filter farmers for search input
function filterFarmers() {
    const searchInput = document.getElementById('farmer-search-input').value.toLowerCase(); // Takes search input
    const farmers = getFarmersFromLocalStorage();
    if (!searchInput) {
        displaySearchFarmers(farmers); // Shows all farmers if no search
        return;
    }

    const filteredFarmers = farmers.filter(farmer => {
        return farmer.farmerFName.toLowerCase().includes(searchInput) ||
            farmer.farmerLName.toLowerCase().includes(searchInput) ||
            farmer.farmerLocation.toLowerCase().includes(searchInput);
    });

    displaySearchFarmers(filteredFarmers);
}

// Function for displaying searched farmer
function displaySearchFarmers(filteredFarmers) {
    const farmerDiv = document.querySelector('.farmer-div');
    farmerDiv.innerHTML = '';

    if (filteredFarmers.length === 0) {
        farmerDiv.innerHTML = "<p>No farmers found</p>"; // If there is no farmer founded
        return;
    }

    filteredFarmers.forEach(farmer => {
        const farmerCard = document.createElement("div");
        farmerCard.className = "each-farmer-div";
        farmerCard.innerHTML = `
            <div class="farmer-name"><h3>${farmer.farmerFName} ${farmer.farmerLName}</h3></div>
            <button onclick="showFarmerDetails(${farmer.farmerId})" class="farmer-div-btn">Details</button>
            <button onclick="editFarmer(${farmer.farmerId})" class="farmer-div-btn">Edit</button>
            <button onclick="purchaseFromFarmer(${farmer.farmerId})" class="farmer-div-btn">Purchase</button>
            <button onclick="deleteFarmer(${farmer.farmerId})" class="farmer-div-btn">Remove</button>
        `;

        // Farmer detail div
        const farmerDetailDiv = document.createElement('div');
        farmerDetailDiv.className = 'farmer-detail-div';
        farmerDetailDiv.style.display = 'none';
        farmerDetailDiv.id = `farmer-detail-${farmer.farmerId}`;

        // Farmer edit div
        const farmerEditDiv = document.createElement('div');
        farmerEditDiv.className = 'farmer-edit-div';
        farmerEditDiv.style.display = 'none';
        farmerEditDiv.id = `farmer-edit-${farmer.farmerId}`;

        // Farmer purchase div
        const farmerPurchaseDiv = document.createElement('div');
        farmerPurchaseDiv.className = 'farmer-purchase-div';
        farmerPurchaseDiv.style.display = 'none';
        farmerPurchaseDiv.id = `farmer-purchase-${farmer.farmerId}`;

        // Append farmer card and detail div
        farmerDiv.appendChild(farmerCard);
        farmerDiv.appendChild(farmerDetailDiv);
        farmerDiv.appendChild(farmerEditDiv);
        farmerDiv.appendChild(farmerPurchaseDiv);
    });
}

// Function for getting berry information for each farmer
function listFarmerBerries(farmer) {
    const berries = getBerriesFromLocalStorage(); // Gets berry data from localStorage
    let berryDetails = '';

    farmer.farmerBerries.forEach(farmerBerry => {
        const berry = berries.find(b => b.berryId === farmerBerry.berryId); // Gets berry info for current farmer
        if (berry) {
            berryDetails += `
                <p>Berry Type: ${berry.berryName}</p>
                <p>Quantity: ${farmerBerry.quantity}</p>
                <p>Price Per Kg: ${farmerBerry.pricePerKg}</p>
            `;
        } else {
            berryDetails += `<p>Unknown Berry (ID: ${farmerBerry.berryId})</p>`;
        }
    });

    return berryDetails || '<p>No berries available.</p>';
}

// Function for showing farmer details for each farmer
function showFarmerDetails(farmerId) {
    const farmerDetailDiv = document.getElementById(`farmer-detail-${farmerId}`);
    const farmers = getFarmersFromLocalStorage(); // Gets farmer info

    // Finds current farmer
    const farmer = farmers.find(f => f.farmerId === farmerId);
    const berryDetails = listFarmerBerries(farmer); // Gets berry information for each farmer

    if (!farmer) {
        console.error(`Farmer with ID ${farmerId} not found.`);
        return;
    }

    // Opens or closes farmer detail div
    if (farmerDetailDiv.style.display === "none" || farmerDetailDiv.style.display === "") {
        farmerDetailDiv.style.display = "block";
        farmerDetailDiv.innerHTML = `
            <div class="farmer-detail-div">
                <h3><u>~Farmer Details~</u></h3>
                <p><strong>Farmer Location:</strong> ${farmer.farmerLocation}</p>
                <p><strong>Farmer Contact:</strong> ${farmer.farmerContact}</p>
                <p><strong>Farmer Berries:</strong> ${berryDetails}</p>
            </div>
            <button type="button" onclick="hideFarmerDetails(${farmerId})" class="sc-btn">Close</button>
        `;
    } else {
        farmerDetailDiv.style.display = "none";
    }
}

// Function for hiding farmer detail div
function hideFarmerDetails(farmerId) {
    const farmerDetailDiv = document.getElementById(`farmer-detail-${farmerId}`);
    farmerDetailDiv.style.display = "none";
    farmerDetailDiv.innerHTML = "";
}

// Function for controlling valid names and location
function isValidName(name) {
    const nameRegex = /^[a-zA-ZığüşöçİĞÜŞÖÇ]+$/;
    return nameRegex.test(name);
}

// Function for controlling valid farmer contact
function isValidContact(contact) {
    const contactRegex = /^\d{11}$/; // Only 11 numbers
    return contactRegex.test(contact);
}

// Function for showing edit farmer div
function editFarmer(farmerId) {
    const farmerEditDiv = document.getElementById(`farmer-edit-${farmerId}`);
    const farmers = getFarmersFromLocalStorage();
    const berries = getBerriesFromLocalStorage();
    const farmer = farmers.find(f => f.farmerId === farmerId);

    if (farmerEditDiv.style.display === "none" || farmerEditDiv.style.display === "") {
        farmerEditDiv.style.display = "block";

        // Takes a list of berry types each farmer sells
        const farmerBerryMap = farmer.farmerBerries.reduce((map, berry) => {
            map[berry.berryId] = { 
                quantity: berry.quantity, 
                pricePerKg: berry.pricePerKg 
            };
            return map;
        }, {});

        // Checkbox + Quantity Input + Price Input list
        const berryCheckboxes = berries.map(berry => {
            const isChecked = farmerBerryMap[berry.berryId] !== undefined;
            const quantityValue = isChecked ? farmerBerryMap[berry.berryId].quantity : 0;
            const priceValue = isChecked ? farmerBerryMap[berry.berryId].pricePerKg : 0;

            return `
                <label>
                    <input type="checkbox" value="${berry.berryId}" 
                        ${isChecked ? "checked" : ""}>
                    ${berry.berryName}
                    <br>
                    Amount:
                    <input type="number" min="0" value="${quantityValue}" 
                        id="berry-quantity-${farmerId}-${berry.berryId}" 
                        ${isChecked ? "" : "disabled"}>
                    <br>
                    Price Per Kg:
                    <input type="number" min="0" value="${priceValue}" 
                        id="berry-price-${farmerId}-${berry.berryId}" 
                        ${isChecked ? "" : "disabled"}>
                </label>
            `;
        }).join('<br>');

        farmerEditDiv.innerHTML = `
            <div class="farmer-edit-div">
                <h3><u>~ Edit Farmer ~</u></h3>
                <label for="farmerFName-${farmerId}">Farmer First Name:</label>
                <input type="text" id="farmerFName-${farmerId}" value="${farmer.farmerFName}" required>
                <br>
                <label for="farmerLName-${farmerId}">Farmer Last Name:</label>
                <input type="text" id="farmerLName-${farmerId}" value="${farmer.farmerLName}" required>
                <br>
                <label for="farmerLocation-${farmerId}">Farmer Location:</label>
                <input type="text" id="farmerLocation-${farmerId}" value="${farmer.farmerLocation}" required>
                <br>
                <label for="farmerContact-${farmerId}">Farmer Contact:</label>
                <input type="text" id="farmerContact-${farmerId}" value="${farmer.farmerContact}" required>
                <br>
                <label>Farmer Berries:</label>
                <div id="farmerBerries-${farmerId}">
                    ${berryCheckboxes}
                </div>
                <br>
            </div>
            <button type="button" onclick="saveFarmerEdits(${farmerId})" class="sc-btn">Save</button>
            <button type="button" onclick="hideFarmerEditDiv(${farmerId})" class="sc-btn">Close</button>
        `;

        // Handles the relation between Checkbox and Quantity/Price Inputs
        document.querySelectorAll(`#farmerBerries-${farmerId} input[type="checkbox"]`).forEach(checkbox => {
            checkbox.addEventListener("change", () => {
                const quantityInput = document.getElementById(`berry-quantity-${farmerId}-${checkbox.value}`);
                const priceInput = document.getElementById(`berry-price-${farmerId}-${checkbox.value}`);
                if (checkbox.checked) {
                    quantityInput.disabled = false;
                    priceInput.disabled = false;
                } else {
                    quantityInput.disabled = true;
                    priceInput.disabled = true;
                    quantityInput.value = 0;
                    priceInput.value = 0;
                }
            });
        });

    } else {
        farmerEditDiv.style.display = "none";
    }
}

// Function for saving farmer edit
function saveFarmerEdits(farmerId) {
    const farmers = getFarmersFromLocalStorage();
    const farmerIndex = farmers.findIndex(f => f.farmerId === farmerId);

    if (farmerIndex === -1) {
        console.error(`Farmer with ID ${farmerId} not found.`);
        return;
    }

    // Gets updated first and last names, contact
    const firstName = document.getElementById(`farmerFName-${farmerId}`).value.trim();
    const lastName = document.getElementById(`farmerLName-${farmerId}`).value.trim();
    const contact = document.getElementById(`farmerContact-${farmerId}`).value.trim();
    const location = document.getElementById(`farmerLocation-${farmerId}`).value.trim();

    // Controls first and list names are valid or not
    if (!isValidName(firstName)) {
        alert("First name must contain only letters.");
        return;
    }
    if (!isValidName(lastName)) {
        alert("Last name must contain only letters.");
        return;
    }
    if (!isValidName(location)) {
        alert("Location must contain only letters.");
        return;
    }

    // Controls if contact valid or not
    if (!isValidContact(contact)) {
        alert("Contact must be 11 digits long and contain only numbers.");
        return;
    }

    // Check if the contact already exists for another farmer
    const contactExists = farmers.some(f => f.farmerId !== farmerId && f.farmerContact === contact);
    if (contactExists) {
        alert("This contact is already in use by another farmer.");
        return;
    }

    // Takes editted input from farmer edit form
    farmers[farmerIndex].farmerFName = firstName;
    farmers[farmerIndex].farmerLName = lastName;
    farmers[farmerIndex].farmerLocation = location;
    farmers[farmerIndex].farmerContact = contact;

    // Takes berry input for each farmer will sell
    const berryCheckboxes = Array.from(document.querySelectorAll(`#farmerBerries-${farmerId} input[type="checkbox"]`));
    const selectedBerries = berryCheckboxes
        .filter(checkbox => checkbox.checked) // Takes only choosen berries
        .map(checkbox => {
            const quantityInput = document.getElementById(`berry-quantity-${farmerId}-${checkbox.value}`);
            const priceInput = document.getElementById(`berry-price-${farmerId}-${checkbox.value}`);

            const quantity = parseInt(quantityInput.value) || 0;
            const pricePerKg = parseInt(priceInput.value) || 0;

            // Check if quantity and price are greater than 0
            if (quantity <= 0) {
                alert(`Quantity for berry must be greater than 0.`);
                throw new Error("Invalid quantity"); // Stops execution
            }
            if (pricePerKg <= 0) {
                alert(`Price per kg for berry must be greater than 0.`);
                throw new Error("Invalid quantity"); // Stops execution
            }

            return {
                berryId: parseInt(checkbox.value), // Berry ID
                quantity: parseInt(quantityInput.value) || 0 ,// Quantity
                pricePerKg: parseInt(priceInput.value) || 0
            };
        });

    farmers[farmerIndex].farmerBerries = selectedBerries;

    // Saves editted farmer to localstorage
    localStorage.setItem('farmers', JSON.stringify(farmers));

    displayFarmers();
    document.getElementById(`farmer-detail-${farmerId}`).style.display = "none";
}

// Function for hiding farmer edit div
function hideFarmerEditDiv(farmerId) {
    const farmerEditDiv = document.getElementById(`farmer-edit-${farmerId}`);
    farmerEditDiv.style.display = "none";
    farmerEditDiv.innerHTML = "";
}

// Function for creating purchase div for each farmer
function purchaseFromFarmer(farmerId) {
    const farmerPurchaseDiv = document.getElementById(`farmer-purchase-${farmerId}`);
    const farmers = getFarmersFromLocalStorage();
    const farmer = farmers.find(f => f.farmerId === farmerId);

    if (farmerPurchaseDiv.style.display === "none" || farmerPurchaseDiv.style.display === "") {
        farmerPurchaseDiv.style.display = "block";

        // Lists berries farmer is selling
        let purchaseForm = `
            <div class="farmer-purchase-div">
                <h3>Purchase Berries from ${farmer.farmerFName} ${farmer.farmerLName}</h3>
        `;

        // Creates a purchase form for each berry type farmer is selling
        farmer.farmerBerries.forEach(berry => {
            const berryData = getBerriesFromLocalStorage().find(b => b.berryId === berry.berryId);
            purchaseForm += `
                <div class="purchase-item">
                <br>
                    <label>${berryData.berryName}:</label>
                    <input type="number" min="0" value="0" id="purchase-quantity-${farmerId}-${berry.berryId}" />
                    <button type="button" onclick="savePurchaseBerry(${farmerId}, ${berry.berryId})" class="sc-btn">Purchase</button>
                </div>
            `;
        });

        purchaseForm += `
            </div>
            <br>
            <button type="button" onclick="hideFarmerPurchaseDiv(${farmerId})" class="sc-btn">Close</button>
        `;

        // Adds purchase form inside the div
        farmerPurchaseDiv.innerHTML = purchaseForm;
    } else {
        farmerPurchaseDiv.style.display = "none";
    }
}

// Function for hiding farmer purchase div
function hideFarmerPurchaseDiv(farmerId) {
    const farmerEditDiv = document.getElementById(`farmer-purchase-${farmerId}`);
    farmerEditDiv.style.display = "none";
    farmerEditDiv.innerHTML = "";
}

// Function for getting price per kg of raw berries
function getPricePerKg(berryId) {
    const berries = getBerriesFromLocalStorage();
    const berry = berries.find(b => b.berryId === berryId);
    return berry ? berry.pricePerKg : 0;
}

// Function for update inventory purchased from farmer
function updateInventory(berryId, quantity, updateDate) {
    const inventory = getInventoryFromLocalStorage();

    // Finds if the berry already exists in inventory
    const inventoryItem = inventory.find(item => item.berryId === berryId);

    if (inventoryItem) {
        // Updates the quantity if the berry exists
        inventoryItem.quantity += quantity;
        inventoryItem.lastUpdated = updateDate;
    } else {
        // Adds a new record if the berry doesn't exist
        inventory.push({
            inventoryId: inventory.length + 1,
            berryId: berryId,
            type: "raw",
            categoryId: 0,
            quantity: quantity,
            unit: "kg",
            storageLocation: `TRB${berryId}`,
            lastUpdated: updateDate,
            reorderLevel: 500
        });
    }

    // Saves updated inventory to localStorage
    localStorage.setItem("inventory", JSON.stringify(inventory));
}

// Function for saving purchase
function savePurchaseBerry(farmerId, berryId) {
    const farmers = getFarmersFromLocalStorage();
    const farmer = farmers.find(f => f.farmerId === farmerId);
    const purchaseQuantityInput = document.getElementById(`purchase-quantity-${farmerId}-${berryId}`);
    const purchaseQuantity = parseInt(purchaseQuantityInput.value) || 0; // Purchased amount

    // Controls valid purchase
    if (purchaseQuantity <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }

    // Finds farmer berries
    const berryIndex = farmer.farmerBerries.findIndex(b => b.berryId === berryId);

    if (berryIndex !== -1) {
        if (farmer.farmerBerries[berryIndex].quantity >= purchaseQuantity) {
            // Reduces berry amount
            farmer.farmerBerries[berryIndex].quantity -= purchaseQuantity;

            // Gets berry price per kg
            const pricePerKg = farmer.farmerBerries[berryIndex].pricePerKg;

            // Creates purchase record
            const purchases = getPurchasesFromLocalStorage();
            const newPurchase = {
                purchaseID: purchases.length > 0 ? purchases.length + 1 : 1,
                farmerID: farmerId,
                berryID: berryId,
                date: new Date().toLocaleDateString('en-GB'),
                quantity: purchaseQuantity,
                pricePerKg: pricePerKg,
                totalCost: (purchaseQuantity * pricePerKg)
            };

            // Adds new purchase record
            purchases.push(newPurchase);
            localStorage.setItem("purchaseRecords", JSON.stringify(purchases)); // Saves purchase records

            // Updates inventory
            updateInventory(berryId, purchaseQuantity, new Date().toLocaleDateString('en-GB'));

            alert(`You purchased ${purchaseQuantity} units of ${getBerriesFromLocalStorage().find(b => b.berryId === berryId).berryName}`);
        } else {
            alert("Not enough quantity available.");
        }
    } else {
        alert("This berry is not available for purchase.");
        return;
    }

    // Saves updated version to localStorage
    localStorage.setItem('farmers', JSON.stringify(farmers));
    displayFarmers();
}

// Function for deleting farmer
function deleteFarmer(farmerId) {
    if (confirm("Are you sure you want to delete this farmer?")) {
        farmers = farmers.filter(farmer => farmer.farmerId !== farmerId);
        localStorage.setItem('farmers', JSON.stringify(farmers));
        displayFarmers();
    }
}

// Function for showing add new farmer form 
function showAddFarmerForm() {
    document.getElementById("add-farmer-form").style.display = "block";

    // Checkbox list for berries
    const berries = getBerriesFromLocalStorage();
    const berryCheckboxes = berries.map(berry => `
        <label>
            <input type="checkbox" value="${berry.berryId}">
            ${berry.berryName}
            <br>
            Amount:
            <input type="number" min="0" value="0" id="new-berry-quantity-${berry.berryId}" disabled>
            <br>
            Price Per Kg:
            <input type="number" min="0" value="0" id="new-berry-price-${berry.berryId}" disabled placeholder="Price per kg">
        </label>
    `).join('<br>');

    document.getElementById("newFarmerBerries").innerHTML = berryCheckboxes;

    // Checkbox and quantity relation for berries
    document.querySelectorAll(`#newFarmerBerries input[type="checkbox"]`).forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            const quantityInput = document.getElementById(`new-berry-quantity-${checkbox.value}`);
            const priceInput = document.getElementById(`new-berry-price-${checkbox.value}`);
            if (checkbox.checked) {
                quantityInput.disabled = false;
                priceInput.disabled = false;
            } else {
                quantityInput.disabled = true;
                priceInput.disabled = true;
                quantityInput.value = 0;
                priceInput.value = 0;
            }
        });
    });
}

// Function for hiding add new farmer form
function hideAddFarmerForm() {
    document.getElementById("add-farmer-form").style.display = "none";
}

// Function for saving information of a newly added farmer
function addNewFarmer() {
    const farmers = getFarmersFromLocalStorage();

    // Takes inputs from new farmer form
    const firstName = document.getElementById("newFarmerFName").value;
    const lastName = document.getElementById("newFarmerLName").value;
    const location = document.getElementById("newFarmerLocation").value;
    const contact = document.getElementById("newFarmerContact").value;

    // Controls first and last names and location are valid or not
    if (!isValidName(firstName)) {
        alert("First name must contain only letters.");
        return;
    }
    if (!isValidName(lastName)) {
        alert("Last name must contain only letters.");
        return;
    }
    if (!isValidName(location)) {
        alert("Location must contain only letters.");
        return;
    }

    // Controls farmer contact is valid or not
    if (!isValidContact(contact)) {
        alert("Contact must be 11 digits long and contain only numbers.");
        return;
    }

    // Check if the contact already exists in any of the farmers
    const isContactTaken = farmers.some(farmer => farmer.farmerContact === contact);
    if (isContactTaken) {
        alert("This contact number is already taken by another farmer.");
        return;
    }

    // Takes berry input for new added farmer
    const berryCheckboxes = Array.from(document.querySelectorAll(`#newFarmerBerries input[type="checkbox"]`));
    const selectedBerries = berryCheckboxes
        .filter(checkbox => checkbox.checked)
        .map(checkbox => {
            const berryId = parseInt(checkbox.value); // Berry ID
            const quantity = parseInt(document.getElementById(`new-berry-quantity-${berryId}`).value) || 0;
            const price = parseInt(document.getElementById(`new-berry-price-${berryId}`).value) || 0;

            // Quantity and price validation
            if (quantity <= 0) {
                alert(`Quantity for berry ID ${berryId} must be greater than 0.`);
                throw new Error("Invalid quantity");
            }
            if (price <= 0) {
                alert(`Price for berry ID ${berryId} must be greater than 0.`);
                throw new Error("Invalid price");
            }

            return {
                berryId: berryId,
                quantity: quantity,
                price: price
            };
        });

    // Creates new id for new added farmer
    const newFarmerId = farmers.length > 0 ? Math.max(...farmers.map(f => f.farmerId)) + 1 : 1;

    // Creates a new farmer object
    const newFarmer = {
        farmerId: newFarmerId,
        farmerFName: firstName,
        farmerLName: lastName,
        farmerLocation: location,
        farmerContact: contact,
        farmerBerries: selectedBerries
    };

    // Pushes new farmer to the farmers list
    farmers.push(newFarmer);

    // Saves changes in localstorage
    localStorage.setItem("farmers", JSON.stringify(farmers));

    // Hides the form and shows updated farmer list
    hideAddFarmerForm();
    displayFarmers();
}


// Function for displaying purcahse records
function showPurchaseRecords() {
    const purchases = getPurchasesFromLocalStorage();
    const farmers = getFarmersFromLocalStorage();
    const berries = getBerriesFromLocalStorage();

    const popupDiv = document.getElementById("popup-purchase-records-div");
    const purchaseTable = document.getElementById("purchase-records-table");

    purchaseTable.innerHTML = "";

    if (purchases.length > 0) {
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `
            <th>Farmer First Name</th>
            <th>Farmer Last Name</th>
            <th>Berry Type</th>
            <th>Quantity</th>
            <th>Price Per Kg</th>
            <th>Total Cost</th>
            <th>Date</th>
        `;
        purchaseTable.appendChild(headerRow);

        purchases.forEach(purchase => {
            const farmer = farmers.find(f => f.farmerId === purchase.farmerID);
            const berry = berries.find(b => b.berryId === purchase.berryID);

            const purchaseRow = document.createElement("tr");
            purchaseRow.innerHTML = `
                <td>${farmer ? farmer.farmerFName : `<span style="color: red;">Unknown</span>`}</td>
                <td>${farmer ? farmer.farmerLName : `<span style="color: red;">Unknown</span>`}</td>
                <td>${berry ? berry.berryName : `<span style="color: red;">Unknown</span>`}</td>
                <td>${purchase.quantity}</td>
                <td>$${purchase.pricePerKg.toFixed(2)}</td>
                <td>$${purchase.totalCost.toFixed(2)}</td>
                <td>${purchase.date}</td>
            `;
            purchaseTable.appendChild(purchaseRow);
        });

    } else {
        const noPurchaseRecords = document.createElement("tr");
        noPurchaseRecords.innerHTML = `<td colspan="3">There is no purchase records.</td>`;
        purchaseTable.appendChild(noPurchaseRecords);
    }
    popupDiv.style.display = "block";
}

// Function for searching purchase records
function searchPurchaseRecords() {
    const searchInput = document.getElementById("purchase-record-input").value.toLowerCase();
    const purchases = getPurchasesFromLocalStorage();
    const farmers = getFarmersFromLocalStorage();
    const berries = getBerriesFromLocalStorage();

    // Filter by search input
    const filteredPurchases = purchases.filter(purchase => {
        const farmer = farmers.find(f => f.farmerId === purchase.farmerID);
        const berry = berries.find(b => b.berryId === purchase.berryID);

        return (
            (farmer && (farmer.farmerFName.toLowerCase().includes(searchInput) || farmer.farmerLName.toLowerCase().includes(searchInput))) ||
            (berry && berry.berryName.toLowerCase().includes(searchInput)) ||
            purchase.quantity.toString().includes(searchInput) ||
            purchase.pricePerKg.toString().includes(searchInput) ||
            purchase.totalCost.toString().includes(searchInput) ||
            purchase.date.toString().includes(searchInput)
        );
    });

    // Calculates total cost
    const totalCost = filteredPurchases.reduce((sum, purchase) => sum + purchase.totalCost, 0);

    // Writes searched records to the table
    displayFilteredPurchases(filteredPurchases, farmers, berries, totalCost);
}

// Function for displaying searched records
function displayFilteredPurchases(filteredPurchases, farmers, berries, totalCost) {
    const purchaseTable = document.getElementById("purchase-records-table");

    // Clear the table before rendering new data
    purchaseTable.innerHTML = "";

    if (filteredPurchases.length > 0) {
        // Add table headers
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `
            <th>Farmer First Name</th>
            <th>Farmer Last Name</th>
            <th>Berry Type</th>
            <th>Quantity (Kg)</th>
            <th>Price Per Kg ($)</th>
            <th>Total Cost ($)</th>
            <th>Date</th>
        `;
        purchaseTable.appendChild(headerRow);

        // Loop through filtered purchases and populate rows
        filteredPurchases.forEach(purchase => {
            // Match farmer and berry records by their IDs
            const farmer = farmers.find(f => f.farmerId.toString() === purchase.farmerID.toString());
            const berry = berries.find(b => b.berryId.toString() === purchase.berryID.toString());

            // Add row for each purchase
            const purchaseRow = document.createElement("tr");
            purchaseRow.innerHTML = `
                <td>${farmer ? farmer.farmerFName : "Unknown"}</td>
                <td>${farmer ? farmer.farmerLName : "Unknown"}</td>
                <td>${berry ? berry.berryName : "Unknown"}</td>
                <td>${purchase.quantity}</td>
                <td>${purchase.pricePerKg.toFixed(2)}</td>
                <td>${purchase.totalCost.toFixed(2)}</td>
                <td>${purchase.date}</td>
            `;
            purchaseTable.appendChild(purchaseRow);
        });

        // Add a total cost row at the end
        const totalRow = document.createElement("tr");
        totalRow.innerHTML = `
            <td colspan="5" style="text-align: right;"><strong>Total Cost:</strong></td>
            <td colspan="2" style="text-align: left;"><strong>$${totalCost.toFixed(2)}</strong></td>
        `;
        purchaseTable.appendChild(totalRow);
    } else {
        // If no records match the filter, display a no results row
        const noResultsRow = document.createElement("tr");
        noResultsRow.innerHTML = `<td colspan="7">No matching records found.</td>`;
        purchaseTable.appendChild(noResultsRow);
    }
}

// Function for filtering purchases by time range
function filterByTimeRange() {
    const timeRange = document.getElementById("time-range").value; // Time range input
    const purchases = getPurchasesFromLocalStorage();

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
        const firstDayOfWeek = today.getDate() - ((today.getDay() + 6) % 7); // Monday is the first day of the week
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

    // Filter purchases
    const filteredPurchases = purchases.filter(purchase => {
        const purchaseDate = parseDate(purchase.date); // Parse date from DD/MM/YYYY
        if (startDate && endDate) {
            return purchaseDate >= startDate && purchaseDate < endDate;
        }
        return true; // Show all records if no range is defined
    });

    // Calculate total cost
    const totalExpense = filteredPurchases.reduce((sum, purchase) => sum + purchase.totalCost, 0);

    // Display the results
    displayFilteredPurchases(filteredPurchases, getFarmersFromLocalStorage(), getBerriesFromLocalStorage(), totalExpense);
}

// Function for hiding popup purchase records div
function hidePurchaseRecords() {
    document.getElementById("popup-purchase-records-div").style.display = "none";
}