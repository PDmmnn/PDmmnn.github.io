// Express server
const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
require('dotenv').config();
const db = require('./db');
const SearchQuery = require('./models/SearchQuery');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Handle form submission to store search queries
app.post('/search', async (req, res) => {
  const { query, email } = req.body;

  try {
    const newQuery = new SearchQuery({ query, email });
    await newQuery.save();
    res.status(201).send('Search query saved successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving search query');
  }
});

// Setup cron job to execute search queries and send emails weekly
cron.schedule('0 0 * * 0', async () => {
  try {
    const queries = await SearchQuery.find().exec();
    // Implement your logic to execute search queries here
    
    // Example email sending logic
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    queries.forEach(async (queryDoc) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: queryDoc.email,
        subject: 'Weekly Search Results',
        text: `Results for your search query: ${queryDoc.query}`,
      };

      await transporter.sendMail(mailOptions);
    });

    console.log('Weekly task executed successfully');
  } catch (err) {
    console.error('Error executing weekly task:', err);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
