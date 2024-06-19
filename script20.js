#index
function showSearchOrders() {
    alert('Suchaufträge anzeigen clicked!');
}

function createNewSearchOrder() {
    alert('Neuen Suchauftrag anlegen clicked!');
}

function cancelSelectedSearchOrders() {
    const checkboxes = document.querySelectorAll('input[name="searchOrder"]:checked');
    if (checkboxes.length > 0) {
        let selectedOrders = [];
        checkboxes.forEach((checkbox) => {
            selectedOrders.push(checkbox.value);
        });
        alert('Markierte Suchaufträge abbestellen: ' + selectedOrders.join(', '));
    } else {
        alert('Keine Suchaufträge ausgewählt.');
    }
}



// Function to show existing search orders
function showSearchOrders() {
    const email = document.getElementById('email').value.trim();
    // Assuming you have stored search orders somehow, fetch or from localStorage
    // Example: Replace this with actual logic to retrieve stored search orders
    const searchOrders = [
        { id: 'suchauftrag1', name: 'Infrastruktur' },
        { id: 'suchauftrag2', name: 'Suchauftrag 2' },
        { id: 'suchauftrag3', name: 'Suchauftrag 3' }
    ];

    const container = document.getElementById('searchOrdersContainer');
    container.innerHTML = ''; // Clear previous content

    searchOrders.forEach(order => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" name="searchOrder" value="${order.id}"> ${order.name}`;
        container.appendChild(label);
    });
}

// Function to create a new search order
function createNewSearchOrder() {
    // Redirect to the search page or modify as needed
    window.location.href = 'https://pdmmnn.github.io/suche.html';
}

// Function to cancel selected search orders
function cancelSelectedSearchOrders() {
    const checkboxes = document.querySelectorAll('input[name="searchOrder"]:checked');
    if (checkboxes.length > 0) {
        let selectedOrders = [];
        checkboxes.forEach((checkbox) => {
            selectedOrders.push(checkbox.value);
            // Optionally, you might want to remove the canceled order from storage here
        });
        alert('Markierte Suchaufträge abbestellen: ' + selectedOrders.join(', '));
    } else {
        alert('Keine Suchaufträge ausgewählt.');
    }
}