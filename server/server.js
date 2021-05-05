require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

const route = require('./routes');
const port = process.env.PORT || 5000;
const db = require('./config/db');
db.connect();

app.use(cors());
app.use(express.json());

route(app);

app.listen(port, () => {
    console.log(`server running in port ${port}`);
});
