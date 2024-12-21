// JS file for assinging default values 

let farmers = [
    {
        "farmerId": 1, "farmerFName": "James", "farmerLName": "Anderson", "farmerContact": "05187989898", "farmerLocation": "Arizona",
        "farmerBerries": [{ "berryId": 1, "quantity": 5000, "pricePerKg": 5  }, { "berryId": 2, "quantity": 3000, "pricePerKg": 8  }, { "berryId": 3, "quantity": 2000, "pricePerKg": 7  }]
    },
    {
        "farmerId": 2, "farmerFName": "Peter", "farmerLName": "Müller", "farmerContact": "05187986868", "farmerLocation": "Switzerland",
        "farmerBerries": [{ "berryId": 1, "quantity": 5000, "pricePerKg": 5  }, { "berryId": 2, "quantity": 3000, "pricePerKg": 8 }]
    }
]

let berries = [
    { "berryId": 1, "berryName": "Strawberry", "pricePerKg": 5 },
    { "berryId": 2, "berryName": "Blueberry", "pricePerKg": 8 },
    { "berryId": 3, "berryName": "Raspberry", "pricePerKg": 7 }
]

let categories = [
    { "categoryId": 0, "categoryName": "Raw", "unit": "kg" },
    { "categoryId": 1, "categoryName": "Small", "weight": 0.1, "unit": "kg", "pricePerUnit": 2 },
    { "categoryId": 2, "categoryName": "Medium", "weight": 0.25, "unit": "kg", "pricePerUnit": 5 },
    { "categoryId": 3, "categoryName": "Large", "weight": 0.5, "unit": "kg", "pricePerUnit": 10 },
    { "categoryId": 4, "categoryName": "Extra Large", "weight": 1, "unit": "kg", "pricePerUnit": 20 },
    { "categoryId": 5, "categoryName": "Family Pack", "weight": 2, "unit": "kg", "pricePerUnit": 40 },
    { "categoryId": 6, "categoryName": "Bulk Pack", "weight": 5, "unit": "kg", "pricePerUnit": 50 },
    { "categoryId": 7, "categoryName": "Premium", "unit": "kg"}
]

let purchaseRecords = [
    { "purchaseID": 1, "farmerID": 1, "berryID": 1, "date": "01/12/2024", "quantity": 1000, "pricePerKg": 5, "totalCost": 5000 },

    { "purchaseID": 2, "farmerID": 1, "berryID": 2, "date": "08/12/2024", "quantity": 800, "pricePerKg": 8, "totalCost": 3200 },
    
    { "purchaseID": 3, "farmerID": 1, "berryID": 3, "date": "13/12/2024", "quantity": 400, "pricePerKg": 7, "totalCost": 2800 },
    { "purchaseID": 4, "farmerID": 2, "berryID": 3, "date": "15/12/2024", "quantity": 500, "pricePerKg": 7, "totalCost": 3500 }
];


let inventory = [
    // BerryId: 1 - First Berry
    {
        "inventoryId": 1, "berryId": 1, "type": "raw", "categoryId": 0, "quantity": 1000, "unit": "kg",
        "storageLocation": "TRB1", "lastUpdated": "01/12/2024", "reorderLevel": 500
    },
    {
        "inventoryId": 2, "berryId": 1, "type": "packaged", "categoryId": 1, "quantity": 150, "unit": "kg",
        "storageLocation": "T1B1", "lastUpdated": "02/12/2024", "reorderLevel": 200
    },
    {
        "inventoryId": 3, "berryId": 1, "type": "packaged", "categoryId": 2, "quantity": 200, "unit": "kg",
        "storageLocation": "T2B1", "lastUpdated": "03/12/2024", "reorderLevel": 200
    },
    {
        "inventoryId": 4, "berryId": 1, "type": "packaged", "categoryId": 3, "quantity": 180, "unit": "kg",
        "storageLocation": "T3B1", "lastUpdated": "04/12/2024", "reorderLevel": 200
    },
    {
        "inventoryId": 5, "berryId": 1, "type": "packaged", "categoryId": 4, "quantity": 220, "unit": "kg",
        "storageLocation": "T4B1", "lastUpdated": "05/12/2024", "reorderLevel": 200
    },
    {
        "inventoryId": 6, "berryId": 1, "type": "packaged", "categoryId": 5, "quantity": 100, "unit": "kg",
        "storageLocation": "T5B1", "lastUpdated": "06/12/2024", "reorderLevel": 200
    },
    {
        "inventoryId": 7, "berryId": 1, "type": "packaged", "categoryId": 6, "quantity": 300, "unit": "kg",
        "storageLocation": "T6B1", "lastUpdated": "07/12/2024", "reorderLevel": 200
    },

    // BerryId: 2 - Second Berry
    {
        "inventoryId": 8, "berryId": 2, "type": "raw", "categoryId": 0, "quantity": 800, "unit": "kg",
        "storageLocation": "TRB2", "lastUpdated": "08/12/2024", "reorderLevel": 200
    },
    {
        "inventoryId": 9, "berryId": 2, "type": "packaged", "categoryId": 1, "quantity": 120, "unit": "kg",
        "storageLocation": "T1B2", "lastUpdated": "09/12/2024", "reorderLevel": 200
    },
    {
        "inventoryId": 10, "berryId": 2, "type": "packaged", "categoryId": 2, "quantity": 160, "unit": "kg",
        "storageLocation": "T2B2", "lastUpdated": "10/12/2024", "reorderLevel": 200
    },
    {
        "inventoryId": 11, "berryId": 2, "type": "packaged", "categoryId": 3, "quantity": 140, "unit": "kg",
        "storageLocation": "T3B2", "lastUpdated": "11/12/2024", "reorderLevel": 200
    },
    {
        "inventoryId": 12, "berryId": 2, "type": "packaged", "categoryId": 4, "quantity": 190, "unit": "kg",
        "storageLocation": "T4B2", "lastUpdated": "12/12/2024", "reorderLevel": 200
    },
    {
        "inventoryId": 13, "berryId": 2, "type": "packaged", "categoryId": 5, "quantity": 90, "unit": "kg",
        "storageLocation": "T5B2", "lastUpdated": "13/12/2024", "reorderLevel": 200
    },
    {
        "inventoryId": 14, "berryId": 2, "type": "packaged", "categoryId": 6, "quantity": 250, "unit": "kg",
        "storageLocation": "T6B2", "lastUpdated": "14/12/2024", "reorderLevel": 200
    },

    // BerryId: 3 - Third Berry
    {
        "inventoryId": 15, "berryId": 3, "type": "raw", "categoryId": 0, "quantity": 900, "unit": "kg",
        "storageLocation": "TRB3", "lastUpdated": "15/12/2024", "reorderLevel": 200
    },
    {
        "inventoryId": 16, "berryId": 3, "type": "packaged", "categoryId": 1, "quantity": 140, "unit": "kg",
        "storageLocation": "T1B3", "lastUpdated": "16/12/2024", "reorderLevel": 200
    },
    {
        "inventoryId": 17, "berryId": 3, "type": "packaged", "categoryId": 2, "quantity": 180, "unit": "kg",
        "storageLocation": "T2B3", "lastUpdated": "17/12/2024", "reorderLevel": 200
    },
    {
        "inventoryId": 18, "berryId": 3, "type": "packaged", "categoryId": 3, "quantity": 170, "unit": "kg",
        "storageLocation": "T3B3", "lastUpdated": "18/12/2024", "reorderLevel": 200
    },
    {
        "inventoryId": 19, "berryId": 3, "type": "packaged", "categoryId": 4, "quantity": 200, "unit": "kg",
        "storageLocation": "T4B3", "lastUpdated": "19/12/2024", "reorderLevel": 200
    },
    {
        "inventoryId": 20, "berryId": 3, "type": "packaged", "categoryId": 5, "quantity": 110, "unit": "kg",
        "storageLocation": "T5B3", "lastUpdated": "20/12/2024", "reorderLevel": 200
    },
    {
        "inventoryId": 21, "berryId": 3, "type": "packaged", "categoryId": 6, "quantity": 260, "unit": "kg",
        "storageLocation": "T6B3", "lastUpdated": "21/12/2024", "reorderLevel": 200
    }
];


let sales = [
    {
        "orderId": 1, "customerName": "Martha Stewart", "customerContact": "05099647852", "shippingAddress": "Chicago",
        "categoryId": 2, "quantity": 150, "totalPrice": 750, "orderStatus": "Shipped", "berryId": 1, "date": "10/12/2024", "kdv": 7.5
    },
    {
        "orderId": 2, "customerName": "John Doe", "customerContact": "05099646789", "shippingAddress": "London",
        "categoryId": 4, "quantity": 250, "totalPrice": 5000, "orderStatus": "Shipped", "berryId": 2, "date": "13/12/2024", "kdv": 50
    },
    {
        "orderId": 3, "customerName": "Jane Smith", "customerContact": "05099645678", "shippingAddress": "Paris",
        "categoryId": 3, "quantity": 180, "totalPrice": 1800, "orderStatus": "Ready", "berryId": 3, "date": "15/12/2024", "kdv": 18
    },
    {
        "orderId": 4, "customerName": "Carlos Garcia", "customerContact": "05099648920", "shippingAddress": "Madrid",
        "categoryId": 5, "quantity": 500, "totalPrice": 20000, "orderStatus": "Shipped", "berryId": 1, "date": "20/12/2024", "kdv": 200
    },
    {
        "orderId": 5, "customerName": "Alicia Reyes", "customerContact": "05099649765", "shippingAddress": "Toronto",
        "categoryId": 2, "quantity": 300, "totalPrice": 1500, "orderStatus": "Ready", "berryId": 2, "date": "21/12/2024", "kdv": 15
    },
    {
        "orderId": 6, "customerName": "David Johnson", "customerContact": "05099640123", "shippingAddress": "Berlin",
        "categoryId": 3, "quantity": 400, "totalPrice": 4000, "orderStatus": "Shipped", "berryId": 3, "date": "21/12/2024", "kdv": 40
    }
];


let packageReports = [
    // BerryId: 1 - First Berry
    { "packagingId": 1, "berryId": 1, "categoryId": 1, "quantity": 150, "unit": "kg", "storageLocation": "T1B1", "date": "02/12/2024" },
    { "packagingId": 2, "berryId": 1, "categoryId": 2, "quantity": 200, "unit": "kg", "storageLocation": "T2B1", "date": "03/12/2024" },
    { "packagingId": 3, "berryId": 1, "categoryId": 3, "quantity": 180, "unit": "kg", "storageLocation": "T3B1", "date": "04/12/2024" },
    { "packagingId": 4, "berryId": 1, "categoryId": 4, "quantity": 220, "unit": "kg", "storageLocation": "T4B1", "date": "05/12/2024" },
    { "packagingId": 5, "berryId": 1, "categoryId": 5, "quantity": 100, "unit": "kg", "storageLocation": "T5B1", "date": "06/12/2024" },
    { "packagingId": 6, "berryId": 1, "categoryId": 6, "quantity": 300, "unit": "kg", "storageLocation": "T6B1", "date": "07/12/2024" },

    // BerryId: 2 - Second Berry
    { "packagingId": 7, "berryId": 2, "categoryId": 1, "quantity": 120, "unit": "kg", "storageLocation": "T1B2", "date": "09/12/2024" },
    { "packagingId": 8, "berryId": 2, "categoryId": 2, "quantity": 160, "unit": "kg", "storageLocation": "T2B2", "date": "10/12/2024" },
    { "packagingId": 9, "berryId": 2, "categoryId": 3, "quantity": 140, "unit": "kg", "storageLocation": "T3B2", "date": "11/12/2024" },
    { "packagingId": 10, "berryId": 2, "categoryId": 4, "quantity": 190, "unit": "kg", "storageLocation": "T4B2", "date": "12/12/2024" },
    { "packagingId": 11, "berryId": 2, "categoryId": 5, "quantity": 90, "unit": "kg", "storageLocation": "T5B2", "date": "13/12/2024" },
    { "packagingId": 12, "berryId": 2, "categoryId": 6, "quantity": 250, "unit": "kg", "storageLocation": "T6B2", "date": "14/12/2024" },

    // BerryId: 3 - Third Berry
    { "packagingId": 13, "berryId": 3, "categoryId": 1, "quantity": 140, "unit": "kg", "storageLocation": "T1B3", "date": "16/12/2024" },
    { "packagingId": 14, "berryId": 3, "categoryId": 2, "quantity": 180, "unit": "kg", "storageLocation": "T2B3", "date": "17/12/2024" },
    { "packagingId": 15, "berryId": 3, "categoryId": 3, "quantity": 170, "unit": "kg", "storageLocation": "T3B3", "date": "18/12/2024" },
    { "packagingId": 16, "berryId": 3, "categoryId": 4, "quantity": 200, "unit": "kg", "storageLocation": "T4B3", "date": "19/12/2024" },
    { "packagingId": 17, "berryId": 3, "categoryId": 5, "quantity": 110, "unit": "kg", "storageLocation": "T5B3", "date": "20/12/2024" },
    { "packagingId": 18, "berryId": 3, "categoryId": 6, "quantity": 260, "unit": "kg", "storageLocation": "T6B3", "date": "21/12/2024" }
];



// If the specified key is not present in localStorage, save the data
function saveDataIfNotExists(key, data) {
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(data));
    }
}

// Save data only if it doesn't exist
saveDataIfNotExists("farmers", farmers);
saveDataIfNotExists("berries", berries);
saveDataIfNotExists("categories", categories);
saveDataIfNotExists("purchaseRecords", purchaseRecords);
saveDataIfNotExists("inventory", inventory);
saveDataIfNotExists("sales", sales);
saveDataIfNotExists("packageReports", packageReports);


/*
// Cleans localStorage
localStorage.removeItem("farmers");
localStorage.removeItem("berries");
localStorage.removeItem("inventory");
localStorage.removeItem("categories");
localStorage.removeItem("sales");
localStorage.removeItem("purchaseRecords");
localStorage.removeItem("packageReports");
alert("Selected keys have been cleared.");
*/