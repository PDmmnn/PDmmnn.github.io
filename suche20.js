// Event listener for form submission to perform normal search
document.getElementById('foerderalertForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = buildQuery();
    search(query);
});

// Event listener for creating weekly search and sending results via email
document.getElementById('createWeeklySearchButton').addEventListener('click', function() {
    executeWeeklySearch();
});

// Function to build query based on form inputs for normal search
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

// Function to perform search based on query
function search(query) {
    const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
    const cx = 'YOUR_CUSTOM_SEARCH_ENGINE_ID'; // Replace with your actual Custom Search Engine ID
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => displayResults(data))
        .catch(error => console.error('Error:', error));
}

// Function to display search results on the web page
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

// Function to execute weekly search and send results via email
function executeWeeklySearch() {
    const searchRequest = JSON.parse(localStorage.getItem('searchRequest'));
    if (!searchRequest) return;

    const query = buildQueryForWeeklySearch();
    search(query)
        .then(data => {
            const filteredResults = filterResultsForLastSevenDays(data.items);
            if (filteredResults.length > 0) {
                const emailSubject = 'Weekly Search Results (Last 7 days)';
                const emailBody = formatEmailBody(filteredResults);
                sendEmail(emailSubject, emailBody, searchRequest.email);
            }
        })
        .catch(error => {
            console.error('Error performing weekly search:', error);
        });
}

// Function to build query for weekly search (last 7 days)
function buildQueryForWeeklySearch() {
    const heute = new Date();
    const vorSiebenTagen = new Date(heute.getTime() - 7 * 24 * 60 * 60 * 1000);
    const heuteString = heute.toISOString().split('T')[0];
    const vorSiebenTagenString = vorSiebenTagen.toISOString().split('T')[0];

    let query = buildQuery(); // Use your existing buildQuery() function
    query += ` AND date>${vorSiebenTagenString} AND date<${heuteString}`;

    return query;
}

// Function to filter results for the last 7 days
function filterResultsForLastSevenDays(items) {
    const heute = new Date();
    const vorSiebenTagen = new Date(heute.getTime() - 7 * 24 * 60 * 60 * 1000);

    return items.filter(item => {
        const itemDate = new Date(item.publishedDate); // Replace with actual date field
        return itemDate >= vorSiebenTagen && itemDate <= heute;
    });
}

// Function to format email body with filtered results
function formatEmailBody(results) {
    let emailBody = 'Here are the search results from the last 7 days:\n\n';
    results.forEach(result => {
        emailBody += `Title: ${result.title}\n`;
        emailBody += `Link: ${result.link}\n\n`;
    });
    return emailBody;
}

// Function to send email using SendGrid API (replace with your actual implementation)
function sendEmail(subject, body, recipient) {
    // Implement your email sending logic here (e.g., using SendGrid API)
    console.log(`Sending email to ${recipient} with subject: ${subject}\nBody:\n${body}`);
}
