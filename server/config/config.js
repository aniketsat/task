require('dotenv').config();

const PORT = process.env.PORT || 8081;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todoDB';

module.exports = {
  PORT,
  MONGO_URI
};