document.getElementById('foerderalertForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const query = buildQuery();
        search(query);
    });

    function buildQuery() {
        const sonstiges = document.getElementById('sonstiges').value.trim();
        const searchbar = document.getElementById('searchbar').value.trim();
        const foerderartbar = document.getElementById('foerderartbar').value.trim();
        const foerderbereichbar = document.getElementById('foerderbereichbar').value.trim();
        const foerderberechtigtbar = document.getElementById('foerderberechtigtbar').value.trim();
        const foerdergebietbar = document.getElementById('foerdergebietbar').value.trim();
        const foerdergeberbar = document.getElementById('foerdergeberbar').value.trim();

        let query = '';

        if (sonstiges) query += sonstiges;
        if (searchbar) query += query ? ` AND "${searchbar}"` : `"${searchbar}"`;
        if (foerderartbar) query += query ? ` AND "${foerderartbar}"` : `"${foerderartbar}"`;
        if (foerderbereichbar) query += query ? ` AND "${foerderbereichbar}"` : `"${foerderbereichbar}"`;
        if (foerderberechtigtbar) query += query ? ` AND "${foerderberechtigtbar}"` : `"${foerderberechtigtbar}"`;
        if (foerdergebietbar) query += query ? ` AND "${foerdergebietbar}"` : `"${foerdergebietbar}"`;
        if (foerdergeberbar) query += query ? ` AND "${foerdergeberbar}"` : `"${foerdergeberbar}"`;

        return query.trim();
    }

    function search(query) {
        const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
        const cx = 'YOUR_SEARCH_ENGINE_ID'; // Replace with your actual Custom Search Engine ID
        const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => displayResults(data))
            .catch(error => console.error('Error:', error));
    }

    function displayResults(data) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        if (data.items) {
            data.items.forEach(item => {
                const resultItem = document.createElement('div');
                resultItem.classList.add('result-item');
                resultItem.innerHTML = `
                    <h2><a href="${item.link}" target="_blank">${item.title}</a></h2>
                    <p>${item.snippet}</p>
                    <div class="result-details">
                        <span>Link: <a href="${item.link}" target="_blank">${item.displayLink}</a></span>
                    </div>
                `;
                resultsDiv.appendChild(resultItem);
            });
        } else {
            resultsDiv.innerHTML = 'No results found';
        }
    }
// Search terms for each search bar
    const searchTermsMain = [
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

    const searchTermsFoerderart = [
        "Region A",
        "Region B",
        "Region C",
        "Region D",
        "Region E",
        "Region F",
        "Region G",
        "Region H"
    ];

    const searchTermsFoerderberechtigt = [
        "Region A",
        "Region B",
        "Region C",
        "Region D",
        "Region E",
        "Region F",
        "Region G",
        "Region H"
    ];

    const searchTermsFoerderbereich = [
        "Region A",
        "Region B",
        "Region C",
        "Region D",
        "Region E",
        "Region F",
        "Region G",
        "Region H"
    ];

    const searchTermsFoerdergebiet = [
        "Region A",
        "Region B",
        "Region C",
        "Region D",
        "Region E",
        "Region F",
        "Region G",
        "Region H"
    ];

    const searchTermsFoerdergeber = [
        "Institution A",
        "Institution B",
        "Institution C",
        "Institution D",
        "Institution E",
        "Institution F",
        "Institution G",
        "Institution H"
    ];

    // Initialize search bars with autocomplete functionality
    initializeSearchBar('searchbar', 'dropdown', searchTermsMain);
    initializeSearchBar('foerderartbar', 'dropdown-foerderart', searchTermsFoerderart);
    initializeSearchBar('foerdergebietbar', 'dropdown-foerdergebiet', searchTermsFoerdergebiet);
    initializeSearchBar('foerdergeberbar', 'dropdown-foerdergeber', searchTermsFoerdergeber);
    initializeSearchBar('foerderberechtigtbar', 'dropdown-foerderberechtigt', searchTermsFoerderberechtigt);
    initializeSearchBar('foerderbereichbar', 'dropdown-foerderbereich', searchTermsFoerderbereich);

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
