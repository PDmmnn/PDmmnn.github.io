from bs4 import BeautifulSoup
import requests
url = "https://www.foerderdatenbank.de/FDB/Content/DE/Foerderprogramm/Land/Sachsen/buergschaft-sachsen-beteiligung.html"

response = requests.get(url)
html_content = response.text
soup = BeautifulSoup(html_content, 'html.parser')

# Extract all <p> tags with class="content"

Ansprechpunkte = soup.find_all('dd', class_='card')
Förderarten = soup.find_all('dd')
#ProgramContents = soup.find_all('div', class_='content')

#Print the text of each paragraph
for Ansprechpunkt in Ansprechpunkte: 
  print (Ansprechpunkt.text)

# Print the text of each item

for Förderart in Förderarten:
  print(Förderart.text)

# for ProgramContent in ProgramContents:

# print(ProgramContent.text)
