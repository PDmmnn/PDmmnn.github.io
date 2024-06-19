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

    function buildQuery() {
    const sonstiges = document.getElementById('sonstiges').value.trim();
    const searchbar = document.getElementById('searchbar').value.trim();
    const foerderartbar = document.getElementById('foerderartbar').value.trim();
    const foerderbereichbar = document.getElementById('foerderbereichbar').value.trim();
    const foerderberechtigtbar = document.getElementById('foerderberechtigtbar').value.trim();
    const foerdergebietbar = document.getElementById('foerdergebietbar').value.trim();
    const foerdergeberbar = document.getElementById('foerdergeberbar').value.trim();

    let query = '';

    if (sonstiges) {
        query += `(${sonstiges})`;
    }
    if (searchbar) {
        const searchTerms = searchbar.split(',').map(term => `"${term.trim()}"`).join(' OR ');
        query += query ? ` AND (${searchTerms})` : `(${searchTerms})`;
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

    // Save form data to GitHub Issues
    saveFormDataToGitHubIssues(formData);
}

// Function to save form data to GitHub Issues
function saveFormDataToGitHubIssues(formData) {
    const repoOwner = 'pdmmnn';
    const repoName = 'pdmmnn.github.io';
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/issues`;

    const issueData = {
        title: `Search Request - ${formData.name}`,
        body: `
            Email: ${formData.email}
            Search Query: ${formData.searchQuery}
        `
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            Authorization: `token YOUR_GITHUB_PERSONAL_ACCESS_TOKEN`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(issueData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Issue created successfully:', data);
        alert('Search request saved successfully!');
    })
    .catch(error => {
        console.error('Error saving to GitHub Issues:', error);
        alert('Failed to save search request. Please try again later.');
    });
}





async function triggerGitHubAction(formResponse) {
  const url = 'https://api.github.com/repos/<your-username>/<your-repo>/actions/workflows/create-issue.yml/dispatches';
  const token = 'YOUR_GITHUB_PERSONAL_ACCESS_TOKEN'; // You'd retrieve this securely

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ref: 'main', // or the branch you want to run the workflow on
      inputs: {
        response: formResponse // pass your form response here
      }
    })
  });

  if (response.ok) {
    console.log('GitHub Action triggered successfully');
  } else {
    console.error('Failed to trigger GitHub Action:', response.statusText);
  }
}

// Example form submission handler
document.getElementById('yourForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const formResponse = new FormData(event.target).entries();
  triggerGitHubAction(Object.fromEntries(formResponse));
});

