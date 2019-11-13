const mongoose = require('mongoose');
const { Games } = require('./schema');

// Connect database
let port = 'localhost'
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(`mongodb://${port}:27017/games`)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(`database connected!`)
})


const saveGame = (game) => {
  Games.insertMany([game])
    .then((data) => {
      console.log('inserted game')
    })
    .catch((err) => {
      console.log('error inserting game')
    })
}

const findAllGames = (callback) => {
  Games.find({})
    .then((data) => {
      callback(null, data)
    })
    .catch((err) => {
      callback(err, null)
    })
}

module.exports.findAllGames = findAllGames;
module.exports.saveGame = saveGame;