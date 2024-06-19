document.getElementById('foerderalertForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = buildQuery();
    search(query);
});

function buildQuery() {
    const searchbar = document.getElementById('searchbar').value;
    const foerderartbar = document.getElementById('foerderartbar').value;
    const foerderbereichbar = document.getElementById('foerderbereichbar').value;
    const foerderberechtigtbar = document.getElementById('foerderberechtigtbar').value;
    const foerdergebietbar = document.getElementById('foerdergebietbar').value;
    const foerdergeberbar = document.getElementById('foerdergeberbar').value;
    const sonstiges = document.getElementById('sonstiges').value;

    let query = '';
    if (searchbar) query += searchbar + ' ';
    if (foerderartbar) query += `+${foerderartbar} `;
    if (foerderbereichbar) query += `+${foerderbereichbar} `;
    if (foerderberechtigtbar) query += `+${foerderberechtigtbar} `;
    if (foerdergebietbar) query += `+${foerdergebietbar} `;
    if (foerdergeberbar) query += `+${foerdergeberbar} `;
    if (sonstiges) query += sonstiges + ' ';

    return query.trim();
}

function search(query) {
    const apiKey = 'AIzaSyAoJA3vFYtqyije1bB9u8flPdn7d2wkKNk';
    const cx = '57f6eed00529f418c';
    const url = `https://www.googleapis.com/customsearch/v1?key=${AIzaSyAoJA3vFYtqyije1bB9u8flPdn7d2wkKNk}&cx=${57f6eed00529f418c}&q=${encodeURIComponent(query)}`;

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

// Initialize search bars with autocomplete functionality (if not already included)
/* existing code for initializing search bars */
