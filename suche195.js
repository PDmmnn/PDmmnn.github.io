document.getElementById('foerderalertForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const query = buildQuery();
        search(query);
    });

    /*function buildQuery() {
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
    }*/

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
    const foerdergebietbar = document.getElementById('foerdergebietbar').value.trim();
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
            for (let i = min; i <= max; i++) {
                amountQuery += `"${i}" Euro OR "${i} Eur" OR "${i} €"`;
                if (i < max) {
                    amountQuery += ' OR ';
                }
            }
            query += query ? ` AND (${amountQuery})` : `(${amountQuery})`;
        }
    } else if (minAmount) {
        const formattedMin = formatAmount(minAmount);
        query += query ? ` AND ("${formattedMin}" Euro OR Eur OR €)` : `("${formattedMin}" Euro OR Eur OR €)`;
    } else if (maxAmount) {
        const formattedMax = formatAmount(maxAmount);
        query += query ? ` AND ("${formattedMax}" Euro OR Eur OR €)` : `("${formattedMax}" Euro OR Eur OR €)`;
    }

    // Percentage search
    if (percentageMin || percentageMax) {
        let percentageQuery = '';
        if (percentageMin && percentageMax) {
            const min = parseInt(percentageMin, 10);
            const max = parseInt(percentageMax, 10);
            if (min <= max) {
                for (let i = min; i <= max; i++) {
                    percentageQuery += `"${i}%" OR "${i} Prozent"`;
                    if (i < max) {
                        percentageQuery += ' OR ';
                    }
                }
            }
        } else if (percentageMin) {
            percentageQuery = `"${percentageMin}%" OR "${percentageMin} Prozent"`;
        } else if (percentageMax) {
            percentageQuery = `"${percentageMax}%" OR "${percentageMax} Prozent"`;
        }
        query += query ? ` AND (${percentageQuery})` : `(${percentageQuery})`;
    }
    if (foerderartbar) {
        const foerderartTerms = foerderartbar.split(',').map(term => `"${term.trim()}"`).join(' OR ');
        query += query ? ` AND (${foerderartTerms})` : `(${foerderartTerms})`;
    }
    if (foerderbereichbar) {
        const foerderbereichTerms = foerderbereichbar.split(',').map(term => `"${term.trim()}"`).join(' OR ');
        query += query ? ` AND (${foerderbereichTerms})` : `(${foerderbereichTerms})`;
    }
    if (foerderberechtigtbar) {
        const foerderberechtigtTerms = foerderberechtigtbar.split(',').map(term => `"${term.trim()}"`).join(' OR ');
        query += query ? ` AND (${foerderberechtigtTerms})` : `(${foerderberechtigtTerms})`;
    }
    if (foerdergebietbar) {
        const foerdergebietTerms = foerdergebietbar.split(',').map(term => `"${term.trim()}"`).join(' OR ');
        query += query ? ` AND (${foerdergebietTerms})` : `(${foerdergebietTerms})`;
    }
    if (foerdergeberbar) {
        const foerdergeberTerms = foerdergeberbar.split(',').map(term => `"${term.trim()}"`).join(' OR ');
        query += query ? ` AND (${foerdergeberTerms})` : `(${foerdergeberTerms})`;
    }

    return query.trim();
}
/*
function formatAmount(amountString) {
    // Replace dots with optional regex to match with or without dots
    return amountString.replace(/\./g, '(\\.?)')
                       .replace(/([0-9,]+) Mio\.?/gi, '$1,?000,000')
                       .replace(/([0-9,]+) Millionen/gi, '$1,?000,000');
}
*/
function formatPercentage(percentageString) {
    // Match numbers between 0 and 100 followed by % or Prozent
    return percentageString.replace(/([0-9]{1,2}) ?[%Prozent]/gi, '$1');
}

    function search(query) {
        const apiKey = 'AIzaSyAoJA3vFYtqyije1bB9u8flPdn7d2wkKNk'; // Replace with your actual API key
        const cx = '57f6eed00529f418c'; // Replace with your actual Custom Search Engine ID
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
        "Deutschland, bundesweit",
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

// JavaScript to toggle tooltip display
const tooltipIcon = document.getElementById('tooltip-foerdergeber');
const tooltipText = document.getElementById('tooltip-text-foerdergeber');

tooltipIcon.addEventListener('click', function() {
    tooltipText.style.display = tooltipText.style.display === 'block' ? 'none' : 'block';
});

// Close tooltip if clicked outside
document.addEventListener('click', function(event) {
    if (!tooltipIcon.contains(event.target)) {
        tooltipText.style.display = 'none';
    }
});

// Prevent closing tooltip on clicks inside the tooltip itself
tooltipText.addEventListener('click', function(event) {
    event.stopPropagation();
});

// Toggle tooltip on touch for mobile devices
tooltipIcon.addEventListener('touchstart', function(event) {
    event.preventDefault(); // Prevents click from being fired
    tooltipText.style.display = tooltipText.style.display === 'block' ? 'none' : 'block';
});

// Close tooltip on touch outside the tooltip itself
document.addEventListener('touchstart', function(event) {
    if (!tooltipIcon.contains(event.target)) {
        tooltipText.style.display = 'none';
    }
});









// Storing Search Query
function createSearchRequest() {
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        searchQuery: buildQuery()
    };

    localStorage.setItem('searchRequest', JSON.stringify(formData));
}

// Execute search and email results every week
function executeWeeklySearch() {
    const searchRequest = JSON.parse(localStorage.getItem('searchRequest'));
    if (!searchRequest) return;

    const query = searchRequest.searchQuery;
    search(query); // Perform the search as defined in your `search` function

    const email = searchRequest.email;
    // Implement email sending logic here (see next section)
}

// Trigger the execution initially and then every week
executeWeeklySearch(); // Execute immediately
setInterval(executeWeeklySearch, 7 * 24 * 60 * 60 * 1000); // Repeat every week

// Sending Email
function sendEmail(subject, body, recipientEmail) {
    const apiKey = 'YOUR_SENDGRID_API_KEY'; // Replace with your SendGrid API key
    const url = 'https://api.sendgrid.com/v3/mail/send';

    const data = {
        personalizations: [{
            to: [{ email: recipientEmail }],
            subject: subject,
        }],
        from: { email: 'your@email.com' }, // Replace with your sender email
        content: [{
            type: 'text/plain',
            value: body,
        }],
    };

    fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to send email');
        }
        console.log('Email sent successfully');
    })
    .catch(error => console.error('Error sending email:', error));
}

// Call sendEmail function in executeWeeklySearch after performing search
// Example:
function executeWeeklySearch() {
    // Previous code...
    const email = searchRequest.email;
    search(query); // Perform the search

    // Assuming you have results in `data`, prepare email content
    const emailSubject = 'Weekly Search Results';
    const emailBody = 'Results: ' + JSON.stringify(data);

    sendEmail(emailSubject, emailBody, email);
}
