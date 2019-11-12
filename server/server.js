const express = require('express')
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '../build')));


let port = 3000;

app.listen(port, () => {
  console.log(`...Listening on port ${port}...`)
})