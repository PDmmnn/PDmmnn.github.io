// script.js

function showSearchOrders() {
    const email = document.getElementById('email').value.trim();
    if (!email) {
        alert('Bitte geben Sie eine E-Mail-Adresse ein.');
        return;
    }

    fetchSearchOrders(email)
        .then(searchOrders => {
            displaySearchOrders(searchOrders);
        })
        .catch(error => {
            console.error('Error fetching search orders:', error);
            alert('Fehler beim Abrufen der Suchaufträge. Bitte versuchen Sie es später erneut.');
        });
}

async function fetchSearchOrders(email) {
    const repoOwner = 'YOUR_GITHUB_USERNAME';
    const repoName = 'YOUR_REPO_NAME';
    const apiUrl = `https://api.github.com/search/issues?q=repo:${repoOwner}/${repoName}+label:search-order+${email}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('Failed to fetch search orders');
    }

    const data = await response.json();
    return data.items.map(item => ({
        id: item.id,
        title: item.title,
        url: item.html_url
    }));
}

function displaySearchOrders(searchOrders) {
    const searchOrdersList = document.getElementById('searchOrdersList');
    searchOrdersList.innerHTML = '';

    searchOrders.forEach(order => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'searchOrder';
        checkbox.value = order.id; // Use ID or unique identifier

        const label = document.createElement('label');
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(order.title));
        
        if (order.url) {
            const link = document.createElement('a');
            link.href = order.url;
            link.textContent = 'öffnen';
            link.target = '_blank'; // Open link in new tab
            label.appendChild(link);
        }

        const div = document.createElement('div');
        div.appendChild(label);
        searchOrdersList.appendChild(div);
    });
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
