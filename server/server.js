const express = require('express')
const path = require('path');
// const db = require('./db');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors);
app.use(express.static(path.join(__dirname, '../build')));

let port = 3000;

// app.get('/', (req, res) => {
//   res.send('hey there')
// })

// app.get('/getAll', (req, res) => {
//   console.log('getting all...')
//   db.findAllGames((err, games) => {
//     if(err){
//       throw err
//     }else{
//       res.send(games);
//     }
//   })
// })

app.listen(port, () => {
  console.log(`...Listening on port ${port}...`)
})
