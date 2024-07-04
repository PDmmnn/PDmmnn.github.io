document.getElementById('foerderalertForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const query = buildQuery();
            search(query);
        });

        function buildQuery() {
    const germanStates = [
        "Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen",
        "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen", "Nordrhein-Westfalen",
        "Rheinland-Pfalz", "Saarland", "Sachsen", "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen",
            "Baden-Württemberg,", "Bayern,", "Berlin,", "Brandenburg,", "Bremen,",
        "Hamburg,", "Hessen,", "Mecklenburg-Vorpommern,", "Niedersachsen,", "Nordrhein-Westfalen,",
        "Rheinland-Pfalz,", "Saarland,", "Sachsen,", "Sachsen-Anhalt,", "Schleswig-Holstein,", "Thüringen,"
    ];
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
            for (let i = min; i <= max; i += 10000) {
                amountQuery += `${formatAmount(i.toString())}`;
                if (i + 10000 <= max) {
                    amountQuery += ' OR ';
                }
            }
            query += query ? ` AND (${amountQuery})` : `(${amountQuery})`;
        }
    } else if (minAmount) {
        query += query ? ` AND (${formatAmount(minAmount)})` : `(${formatAmount(minAmount)})`;
    } else if (maxAmount) {
        query += query ? ` AND (${formatAmount(maxAmount)})` : `(${formatAmount(maxAmount)})`;
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
        const foerderartTerms = foerderartbar.split(',')
            .map(term => term.trim())
            .filter(term => term !== '')  // Filter out empty terms
            .map(term => `"${term}"`)
            .join(' OR ');
        query += query ? ` AND (${foerderartTerms})` : `(${foerderartTerms})`;
    }

    if (foerderbereichbar) {
        const foerderbereichTerms = foerderbereichbar.split(',')
            .map(term => term.trim())
            .filter(term => term !== '')  // Filter out empty terms
            .map(term => `"${term}"`)
            .join(' OR ');
        query += query ? ` AND (${foerderbereichTerms})` : `(${foerderbereichTerms})`;
    }

    if (foerderberechtigtbar) {
        let foerderberechtigtTerms;
        if (window.location.href.startsWith('https://www.foerderdatenbank.de')) {
            foerderberechtigtTerms = foerderberechtigtbar.split(',')
                .map(term => term.trim())
                .filter(term => term !== '')
                //.map(term => `"Förderberechtigte: ${term}" OR "${term}*berechtigt*"`)
                .map(term => `"Förderberechtigte\\s*:\\s*${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}" OR "*berechtigt* ${term}"`)
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
                .join(' OR ');
                const isGermanState = germanStates.some(state => foerdergebietTerms.includes(state));
        if (isGermanState) {
            query += query ? ` AND (${foerdergebietTerms} OR "bundesweit")` : `(${foerdergebietTerms} OR "bundesweit")`;
        } else {
            query += query ? ` AND (${foerdergebietTerms})` : `(${foerdergebietTerms})`;
        }
        } else {
            foerdergebietTerms = foerdergebietbar.split(',')
                .map(term => term.trim())
                .filter(term => term !== '')
                .map(term => `"${term}"`)
                .join(' OR ');
                const isGermanState = germanStates.some(state => foerdergebietTerms.includes(state));
        if (isGermanState) {
            query += query ? ` AND (${foerdergebietTerms} OR "bundesweit")` : `(${foerdergebietTerms} OR "bundesweit")`;
        } else {
            query += query ? ` AND (${foerdergebietTerms})` : `(${foerdergebietTerms})`;
        }
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
            fetch(`/search?query=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => displayResults(data))
                .catch(error => console.error('Error:', error));
        }

        function displayResults(data) {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';
            data.forEach(item => {
                const resultItem = document.createElement('div');
                resultItem.classList.add('result-item');
                resultItem.innerHTML = `
                    <h2><a href="${item.link}" target="_blank">${item.title}</a></h2>
                    <p>${item.snippet}</p>
                `;
                resultsDiv.appendChild(resultItem);
            });
        }

        function createSearchRequest() {
            const formData = {
                query: buildQuery(),
                email: document.getElementById('email').value.trim()
            };
            fetch('/weekly_search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
        }
