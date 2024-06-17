#suche
document.getElementById('foerderalertForm').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Form submitted!');
});

function createSearchRequest() {
    alert('Suchauftrag erstellt!');
}

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
