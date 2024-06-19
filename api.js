document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('query').value;
    search(query);
});

function search(query) {
    const apiKey = 'AIzaSyAoJA3vFYtqyije1bB9u8flPdn7d2wkKNk';
    const cx = '57f6eed00529f418c';
    const url = `https://www.googleapis.com/customsearch/v1?key=${YOUR_API_KEY}&cx=${cx}&q=${query}`;

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
            resultItem.innerHTML = `
                <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                <p>${item.snippet}</p>
            `;
            resultsDiv.appendChild(resultItem);
        });
    } else {
        resultsDiv.innerHTML = 'No results found';
    }
}
