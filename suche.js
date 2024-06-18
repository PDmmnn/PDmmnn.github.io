document.getElementById('foerderalertForm').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Form submitted!');
});

function createSearchRequest() {
    alert('Suchauftrag erstellt!');
}

// Load search terms from JSON file
let searchTermsMain = [];
fetch('searchterms.json')
    .then(response => response.json())
    .then(data => searchTerms = data);

let searchTermsFoerderberechtigt = [];
fetch('searchterms.json')
    .then(response => response.json())
    .then(data => searchTerms = data);

let searchTermsFoerderbereich = [];
fetch('searchterms.json')
    .then(response => response.json())
    .then(data => searchTerms = data);

// Search terms for each search bar
let searchTermsFoerdergebiet = [
    "Region A",
    "Region B",
    "Region C",
    "Region D",
    "Region E",
    "Region F",
    "Region G",
    "Region H"
];

let searchTermsFoerdergeber = [
    "Institution A",
    "Institution B",
    "Institution C",
    "Institution D",
    "Institution E",
    "Institution F",
    "Institution G",
    "Institution H"
];

// Initialize search bars
initializeSearchBar('searchbar', 'dropdown', searchTermsMain);
initializeSearchBar('foerdergebietbar', 'dropdown-foerdergebiet', searchTermsFoerdergebiet);
initializeSearchBar('foerdergeberbar', 'dropdown-foerdergeber', searchTermsFoerdergeber);
initializeSearchBar('foerderberechtigtbar', 'dropdown-foerderberechtigt', searchTermsFoerderberechtigt);
initializeSearchBar('foerdergebereichbar', 'dropdown-foerderbereich', searchTermsFoerderbereich);

function initializeSearchBar(inputId, dropdownId, searchTerms) {
    const searchBar = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);

    searchBar.addEventListener('input', function() {
        updateDropdown(searchBar, dropdown, searchTerms);
    });

    searchBar.addEventListener('focus', function() {
        updateDropdown(searchBar, dropdown, searchTerms);
    });

    function updateDropdown(searchBar, dropdown, searchTerms) {
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
}
