from flask import Flask, request, jsonify, render_template
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('basic.html')

@app.route('/search')
def search():
    term = request.args.get('term')
    results = scrape_website(term)
    return jsonify({'results': results})

def scrape_website(search_term):
    url = f'https://www.foerderdatenbank.de/'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    results = []
    for item in soup.find_all(text=True):
        if search_term.lower() in item.lower():
            results.append(item.strip())

    return results

if __name__ == '__main__':
    app.run(debug=True)
