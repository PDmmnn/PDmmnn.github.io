from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from sqlalchemy import create_engine, Column, String, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import sendgrid
from sendgrid.helpers.mail import Mail

app = Flask(__name__)

# Database setup
DATABASE_URL = 'sqlite:///search.db'
engine = create_engine(DATABASE_URL)
Base = declarative_base()

class SearchResult(Base):
    __tablename__ = 'search_results'
    id = Column(Integer, primary_key=True)
    title = Column(String)
    link = Column(String)
    snippet = Column(String)

Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

# Function to scrape websites
def scrape_website(query):
    # Example for scraping a website
    url = f"https://www.foerderdatenbank.de/FDB/Content/DE/Foerderprogramm*?q={query}"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    results = []
    for item in soup.select('.result-item'):
        title = item.select_one('.result-title').text
        link = item.select_one('.result-link')['href']
        snippet = item.select_one('.result-snippet').text
        
        result = SearchResult(title=title, link=link, snippet=snippet)
        session.add(result)
        results.append({
            'title': title,
            'link': link,
            'snippet': snippet
        })
    
    session.commit()
    return results

# Route to handle search requests
@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query')
    results = scrape_website(query)
    return jsonify(results)

# Function to send email
def send_email(subject, body, recipient):
    sg = sendgrid.SendGridAPIClient(api_key='YOUR_SENDGRID_API_KEY')
    email = Mail(
        from_email='your@email.com',
        to_emails=recipient,
        subject=subject,
        plain_text_content=body)
    sg.send(email)

# Weekly search execution
@app.route('/weekly_search', methods=['POST'])
def weekly_search():
    data = request.json
    query = data.get('query')
    email = data.get('email')
    
    results = scrape_website(query)
    body = "\n".join([f"{result['title']}\n{result['link']}\n{result['snippet']}\n" for result in results])
    
    send_email('Weekly Search Results', body, email)
    return jsonify({'status': 'Email sent successfully'})

if __name__ == '__main__':
    app.run(debug=True)
