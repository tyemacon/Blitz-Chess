import Piece from './Piece';
import images from './piece-images';

export default class Pawn extends Piece {
  constructor(player){
    super(player, 1, (player === 'ONE' ? images.pawn.white : images.pawn.black))
    this.availableSpaces =  this.availableSpaces.bind(this)
  }

  // return an array of available spaces
  availableSpaces(x, y, board, player){
    let availableSpaces = [];
    let pawnMoves = []
    if(this.player === 'ONE'){
      pawnMoves = [[1,0]]
      if(x === 1){
        pawnMoves.push([2,0])
      }
      // Check for enemies
      if(this.isValidTile(x + 1, y + 1)){
        if(board[x + 1][y + 1].piece){
          if(board[x + 1][y + 1].piece.player !== player){
            availableSpaces.push([x + 1, y + 1])
          }
        }
      }
      if(this.isValidTile(x + 1, y - 1)){
        if(board[x + 1][y - 1].piece){
          if(board[x + 1][y - 1].piece.player !== player){
            availableSpaces.push([x + 1, y - 1])
          }
        }
      }
    }else{
      pawnMoves = [[-1,0]]
      if(x === 6){
        pawnMoves.push([-2,0])
      }
      // Check for enemies
      if(this.isValidTile(x - 1, y + 1)){
        if(board[x - 1][y + 1].piece){
          if(board[x - 1][y + 1].piece.player !== player){
            availableSpaces.push([x - 1, y + 1])
          }
        }
      }
      if(this.isValidTile(x - 1, y - 1)){
        if(board[x - 1][y - 1].piece){
          if(board[x - 1][y - 1].piece.player !== player){
            availableSpaces.push([x - 1, y - 1])
          }
        }
      }
    }
    pawnMoves.forEach((dir) => {
      if(this.isValidTile(x + dir[0], y + dir[1])){
        if(!board[x + dir[0]][y + dir[1]].piece){
          availableSpaces.push([x + dir[0], y + dir[1]])
        }
      }
    })
    return availableSpaces;
  }

}