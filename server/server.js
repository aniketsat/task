const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const {PORT} = require('./config/config');
const connectDB = require('./config/db');

const app = express();

app.use(cors());
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );

app.get('/', (req, res) => {
  res.send('Hello World');
});

const todoRoute = require('./routes/todoRoute');
app.use('/api/todos', todoRoute);

const userRoute = require('./routes/userRoute');
app.use('/api/users', userRoute);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server listening on port ${PORT}`);
});