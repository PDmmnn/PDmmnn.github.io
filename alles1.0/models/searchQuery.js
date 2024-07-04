// MongoDB schema
const mongoose = require('mongoose');

const searchQuerySchema = new mongoose.Schema({
  query: { type: String, required: true },
  email: { type: String, required: true },
});

const SearchQuery = mongoose.model('SearchQuery', searchQuerySchema);

module.exports = SearchQuery;
