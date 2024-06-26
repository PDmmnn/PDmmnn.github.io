document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const searchTerm = document.getElementById('search-term').value;
    fetch(`/search?term=${searchTerm}`)
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';
            if (data.results.length === 0) {
                resultsDiv.innerHTML = '<p>No results found.</p>';
            } else {
                data.results.forEach(result => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'result-item';
                    resultItem.innerText = result;
                    resultsDiv.appendChild(resultItem);
                });
            }
        });
});
