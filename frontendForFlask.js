document.getElementById('foerderalertForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const query = buildQuery();
            search(query);
        });

        function buildQuery() {
            // Build query logic as per the original code
            return "example query";
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
