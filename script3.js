document.getElementById('foerderalertForm').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Form submitted!');
});

function createSearchRequest() {
    alert('Suchauftrag erstellt!');
}

// Search terms directly in the JavaScript
let searchTerms = [
    "Zuschuss",
    "Garantie",
    "Darlehen",
    "Sonstiges",
    "Beteiligung",
    "Bürgschaft",
    "Förderung",
    "Subvention",
    "Projektfinanzierung",
    "Investitionszuschuss"
];

// Handle the search bar input
const searchBar = document.getElementById('searchbar');
const dropdown = document.getElementById('dropdown');

searchBar.addEventListener('input', function() {
    const input = searchBar.value.toLowerCase().split(',').pop().trim();
    dropdown.innerHTML = '';
    if (input) {
        const filteredTerms = searchTerms.filter(term => term.toLowerCase().includes(input));
        filteredTerms.forEach(term => {
            const div = document.createElement('div');
            div.textContent = term;
            div.addEventListener('click', function() {
                let terms = searchBar.value.split(',').map(t => t.trim());
                terms.pop(); // Remove the current input
                terms.push(term); // Add the selected term
                searchBar.value = terms.join(', ') + ', ';
                dropdown.style.display = 'none';
                searchBar.focus();
            });
            dropdown.appendChild(div);
        });
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
});

// Hide dropdown if clicked outside
document.addEventListener('click', function(event) {
    if (!searchBar.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});
