document.getElementById('foerderalertForm').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Form submitted!');
});

function createSearchRequest() {
    alert('Suchauftrag erstellt!');
}

// Load search terms from JSON file
let searchTerms = [];
fetch('searchterms.json')
    .then(response => response.json())
    .then(data => searchTerms = data);

// Search terms directly in the JavaScript
/*let searchTerms = [
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
];*/

// Handle the search bar input and focus
const searchBar = document.getElementById('searchbar');
const dropdown = document.getElementById('dropdown');

searchBar.addEventListener('input', function() {
    updateDropdown();
});

searchBar.addEventListener('focus', function() {
    updateDropdown();
});

function updateDropdown() {
    const input = searchBar.value.toLowerCase().split(',').pop().trim();
    dropdown.innerHTML = '';
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
    dropdown.style.display = filteredTerms.length ? 'block' : 'none';
}

// Hide dropdown if clicked outside
document.addEventListener('click', function(event) {
    if (!searchBar.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});
