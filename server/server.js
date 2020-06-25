const express = require('express')
const path = require('path');
// const db = require('./db');
// const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(cors);
app.use(express.static(path.join(__dirname, '/../build')));

let port = 3030;

app.get('/', (req, res) => {
  res.send('hey there')
})


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/../build/index.html"))
});

app.listen(port, () => {
  console.log(`...Listening on port ${port}...`)
})
