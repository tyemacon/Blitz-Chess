const mongoose = require('mongoose')


const pieceSchema = new mongoose.Schema({
  style: {
    backgroundImage: String,
    backgroundPosition: String,
    backgroundRepeat: String,
    backgroundSize: String,
  }

})

const squareSchema = new mongoose.Schema({
  position: [Number],
  piece: pieceSchema,
})

const rowSchema = new mongoose.Schema({
  row: [squareSchema]
})

const gameSchema = new mongoose.Schema({
  game_id: {
    type: Number,
    unique: true
  },
  player_one: String, 
  player_two: String,
  board: [rowSchema]
})

const Games = mongoose.model('Games', gameSchema);

module.exports.Games = Games;

