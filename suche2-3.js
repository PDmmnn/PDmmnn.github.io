document.getElementById('foerderalertForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const query = buildQuery();
        search(query);
    });

    function formatAmount(amountString) {
    const amount = parseFloat(amountString.replace(/,/g, ''));
    if (isNaN(amount)) {
        return amountString;
    }

    const formats = [];

    // Format as plain number
    formats.push(amount.toLocaleString('de-DE')); // German locale for number formatting (1.000.000)

    // Format as millions
    const million = amount / 1000000;
    if (million >= 1) {
        formats.push(`${million.toFixed(1)} Mio`);
        formats.push(`${million.toFixed(1)} Millionen`);
        formats.push(`${million.toFixed(1).replace('.', ',')} Mio`);
        formats.push(`${million.toFixed(1).replace('.', ',')} Millionen`);
    }

    return formats.join(' OR ');
}

    function buildQuery() {
    const sonstiges = document.getElementById('sonstiges').value.trim();
    const minAmount = document.getElementById('minAmount').value.trim();
    const maxAmount = document.getElementById('maxAmount').value.trim();
    const percentageMin = document.getElementById('percentageMin').value.trim();
    const percentageMax = document.getElementById('percentageMax').value.trim();
    const foerderartbar = document.getElementById('foerderartbar').value.trim();
    const foerderbereichbar = document.getElementById('foerderbereichbar').value.trim();
    const foerderberechtigtbar = document.getElementById('foerderberechtigtbar').value.trim();
    const foerdergebietbar = "Bremen, bundesweit"; //document.getElementById('foerdergebietbar').value.trim();
    const foerdergeberbar = document.getElementById('foerdergeberbar').value.trim();

    let query = '';

    if (sonstiges) {
        query += `(${sonstiges})`;
    }
      // Amount search
    if (minAmount && maxAmount) {
        const min = parseInt(minAmount, 10);
        const max = parseInt(maxAmount, 10);
        if (min <= max) {
            let amountQuery = '';
            for (let i = min; i <= max; i += 10000) {
                amountQuery += `${formatAmount(i.toString())}`;
                if (i + 10000 <= max) {
                    amountQuery += ' OR ';
                }
            }
            query += query ? ` NEAR (${amountQuery})` : `(${amountQuery})`;
        }
    } else if (minAmount) {
        query += query ? ` NEAR (${formatAmount(minAmount)})` : `(${formatAmount(minAmount)})`;
    } else if (maxAmount) {
        query += query ? ` NEAR (${formatAmount(maxAmount)})` : `(${formatAmount(maxAmount)})`;
    }

    // Percentage search
    if (percentageMin || percentageMax) {
        let percentageQuery = '';
        if (percentageMin && percentageMax) {
            const min = parseInt(percentageMin, 10);
            const max = parseInt(percentageMax, 10);
            if (min <= max) {
                for (let i = min; i <= max; i++) {
                    percentageQuery += `"${i}" AROUND(1) "%" OR "Prozent"`; //+= `"${i}%" OR "${i} %" OR "${i} Prozent"`;
                    if (i < max) {
                        percentageQuery += ' OR ';
                    }
                }
            }
        } else if (percentageMin) {
            percentageQuery = `"${percentageMin}%" OR "${percentageMin} %" OR "${percentageMin} Prozent"`;
        } else if (percentageMax) {
            percentageQuery = `"${percentageMax}%" OR "${percentageMax} %" OR "${percentageMax} Prozent"`;
        }
        query += query ? ` NEAR (${percentageQuery})` : `(${percentageQuery})`;
    }
    if (foerderartbar) {
        const foerderartTerms = foerderartbar.split(',')
            .map(term => term.trim())
            .filter(term => term !== '')  // Filter out empty terms
            .map(term => `"${term}"`)
            .map(term => `"${term}" AROUND(20) "Förderart:"`)
            .join(' OR ');
        query += query ? ` AND (${foerderartTerms})` : `(${foerderartTerms})`;
    }

    if (foerderbereichbar) {
        const foerderbereichTerms = foerderbereichbar.split(',')
            .map(term => term.trim())
            .filter(term => term !== '')  // Filter out empty terms
            .map(term => `"${term}"`)
            .join(' OR ');
        query += query ? ` NEAR (${foerderbereichTerms})` : `(${foerderbereichTerms})`;
    }

    if (foerderberechtigtbar) {
        let foerderberechtigtTerms;
        if (window.location.href.startsWith('https://www.foerderdatenbank.de')) {
            foerderberechtigtTerms = foerderberechtigtbar.split(',')
                .map(term => term.trim())
                .filter(term => term !== '')
                //.map(term => `"Förderberechtigte: ${term}" OR "${term}*berechtigt*"`)
                .map(term => `"Förderberechtigte\\s*:\\s*${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}" OR "*berechtigt* ${term}"`)
                .map(term => `"${term}" AROUND(20) "Förderberechtigte:" OR "*berechtigt*"`)
                .join(' OR ');
        } else {
            foerderberechtigtTerms = foerderberechtigtbar.split(',')
                .map(term => term.trim())
                .filter(term => term !== '')
                .map(term => `"${term}"`)
                .join(' OR ');
        }
        query += query ? ` AND (${foerderberechtigtTerms})` : `(${foerderberechtigtTerms})`;
    }

    if (foerdergebietbar) {
        let foerdergebietTerms;
        if (window.location.href.startsWith('https://www.foerderdatenbank.de')) {
            foerdergebietTerms = foerdergebietbar.split(',')
                .map(term => term.trim())
                .filter(term => term !== '')
                //.map(term => `"Fördergebiet: ${term}" OR "*ebiet* ${term}"`)
                .map(term => `"Fördergebiet\\s*:\\s*${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}" OR "*ebiet* ${term}"`)
                .map(term => `"${term}" AROUND(20) "Fördergebiet:"`)
                .join(' OR ');
        } else {
            foerdergebietTerms = foerdergebietbar.split(',')
                .map(term => term.trim())
                .filter(term => term !== '')
                .map(term => `"${term}"`)
                .join(' OR ');
        }
        query += query ? ` AND (${foerdergebietTerms})` : `(${foerdergebietTerms})`;
    }

    if (foerdergeberbar) {
        const foerdergeberTerms = foerdergeberbar.split(',')
            .map(term => term.trim())
            .filter(term => term !== '')  // Filter out empty terms
            .map(term => `"${term}"`)
            .join(' OR ');
        query += query ? ` AND (${foerdergeberTerms})` : `(${foerdergeberTerms})`;
    }

    return query.trim();
}

function formatPercentage(percentageString) {
    // Match numbers between 0 and 100 followed by % or Prozent
    return percentageString.replace(/([0-9]{1,2}) ?[%Prozent]/gi, '$1');
}

function search(query) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = 'Suche läuft...';
        
        const apiKey = 'AIzaSyDor3KeS2NUadNOejG1-UsJiuksdgA5wZs'; // Replace with your actual API key
        const cx = 'c186732db6bed4a3f'; // Replace with your actual Custom Search Engine ID
        const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => displayResults(data))
            .catch(error => console.error('Error:', error));
    }

function processResults(data, query) {
            if (data.items) {
                const searchTerms = query.split(' AND ').flatMap(term => term.replace(/"/g, '').split(' OR ').map(t => t.trim().toLowerCase()));
                data.items.forEach(item => {
                    const title = item.title.toLowerCase();
                    const snippet = item.snippet.toLowerCase();
                    item.termFrequency = searchTerms.reduce((acc, term) => {
                        return acc + (title.match(new RegExp(term, 'g')) || []).length + (snippet.match(new RegExp(term, 'g')) || []).length;
                    }, 0);
                });

                // Sort results by term frequency
                data.items.sort((a, b) => b.termFrequency - a.termFrequency);

                displayResults(data);
            } else {
                displayResults({items: []});
            }
        }


    function displayResults(data) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = ''; // Clear previous results ("Suche läuft...")

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
            resultsDiv.innerHTML = 'Keine Ergebnisse Gefunden';
        }
    }
// Search terms for each search bar
    const searchTermsFoerderart = [
        "Beteiligung",
        "Bürgschaft",
        "Darlehen",
        "Förderung",
        "Garantie",
        "Investitionszuschuss",
        "Projektfinanzierung",
        "Subvention",
        "Zuschuss"
    ];

    const searchTermsFoerderberechtigt = [
        "Bildungseinrichtung",
        "Existenzgründer/in",
        "Forschungseinrichtung",
        "Hochschule",
        "Kommune",
        "Öffentliche Einrichtung",
        "Privatperson",
        "Unternehmen",
        "Verband",
        "Vereinigung"
    ];

    const searchTermsFoerderbereich = [
    "Arbeit",
    "Aus- & Weiterbildung",
    "Außenwirtschaft",
    "Beratung",
    "Corona-Hilfe",
    "Digitalisierung",
    "Energieeffizienz & Erneuerbare Energien",
    "Existenzgründung & -festigung",
    "Forschung & Innovation (themenoffen)",
    "Forschung & Innovation (themenspezifisch)",
    "Frauenförderung",
    "Gesundheit & Soziales",
    "Infrastruktur",
    "Kultur, Medien & Sport",
    "Landwirtschaft & Ländliche Entwicklung",
    "Messen & Ausstellungen",
    "Mobilität",
    "Regionalförderung",
    "Smart Cities & Regionen",
    "Städtebau & Stadterneuerung",
    "Umwelt- & Naturschutz",
    "Unternehmensfinanzierung",
    "Wohnungsbau & Modernisierung"
];

    const searchTermsFoerdergebiet = [
        "Bremen",
        "bundesweit",
        "EU",
        "Niedersachsen"
    ];

    const searchTermsFoerdergeber = [
        "Bund",
        "EU",
        "Land"
    ];

    // Initialize search bars with autocomplete functionality
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
