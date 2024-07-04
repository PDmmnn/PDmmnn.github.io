import requests
from bs4 import BeautifulSoup
import pandas as pd
import json

# URL of the page to scrape
url = "https://www.foerderdatenbank.de/FDB/DE/Foerdersuche/foerdersuche.html"

# Send a GET request to the page
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# Initialize lists to store scraped data
links = []
foerderart = []
foerderbereich = []
foerderberechtigt = []
foerdergebiet = []
foerdergeber = []

# Define a function to extract and append data to lists
def extract_and_append_data(item, category, list_to_append):
    data = item.find('dd', class_=category)
    if data:
        list_to_append.append(data.get_text(strip=True))
    else:
        list_to_append.append('N/A')

# Find all the items to be scraped
items = soup.find_all('div', class_='item-class-name') # Update the class name accordingly

for item in items:
    # Extract and append the link
    link_tag = item.find('a', href=True)
    if link_tag:
        links.append(link_tag['href'])
    else:
        links.append('N/A')
    
    # Extract and append other details
    extract_and_append_data(item, 'foerderart-class-name', foerderart) # Update the class name accordingly
    extract_and_append_data(item, 'foerderbereich-class-name', foerderbereich) # Update the class name accordingly
    extract_and_append_data(item, 'foerderberechtigt-class-name', foerderberechtigt) # Update the class name accordingly
    extract_and_append_data(item, 'foerdergebiet-class-name', foerdergebiet) # Update the class name accordingly
    extract_and_append_data(item, 'foerdergeber-class-name', foerdergeber) # Update the class name accordingly

# Create a DataFrame
df = pd.DataFrame({
    'Link to site': links,
    'Förderart': foerderart,
    'Förderbereich': foerderbereich,
    'Förderberechtigt': foerderberechtigt,
    'Fördergebiet': foerdergebiet,
    'Fördergeber': foerdergeber
})

# Save DataFrame to a CSV file
df.to_csv('foerderprogramme.csv', index=False)

# Extract unique search terms
search_terms = {
    'main': df['Förderart'].dropna().unique().tolist(),
    'foerdergebiet': df['Fördergebiet'].dropna().unique().tolist(),
    'foerdergeber': df['Fördergeber'].dropna().unique().tolist()
}

# Save search terms to a JSON file
with open('search_terms.json', 'w') as f:
    json.dump(search_terms, f)

print('Data scraped and saved to foerderprogramme.csv and search_terms.json')
