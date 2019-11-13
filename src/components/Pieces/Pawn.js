import Piece from './Piece';
import images from './piece-images';

export default class Pawn extends Piece {
  constructor(player){
    super(player, 1, (player === 'ONE' ? images.pawn.white : images.pawn.black))
    this.availableSpaces =  this.availableSpaces.bind(this)
  }

  // return an array of available spaces
  availableSpaces(x, y, board, player, history){
    let availableSpaces = [];
    availableSpaces.passants = [];
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
      // Check for En Passant :(
      if(x === 4){
        let moves = history.length - 1;
        let moveFrom = history[moves][0];
        let moveTo = history[moves][1];
        if(y === 0){
          if(moveFrom[6][1].piece && moveTo[4][1]){
            availableSpaces.push([5, y + 1])
            availableSpaces.passants.push([5, y + 1])
          }
        }else if(y === 7){
          if(moveFrom[6][6].piece && moveTo[4][6]){
            availableSpaces.push([5, y - 1])
            availableSpaces.passants.push([5, y - 1])
          }
        }else{
          if(moveFrom[6][y + 1].piece && moveTo[4][y + 1].piece){
            availableSpaces.push([5, y + 1])
            availableSpaces.passants.push([5, y + 1])
          }
          if(moveFrom[6][y - 1].piece && moveTo[4][y - 1].piece){
            availableSpaces.push([5, y - 1])
            availableSpaces.passants.push([5, y - 1])
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
      // Check for En Passant :(
      if(x === 3){
        let moves = history.length - 1;
        let moveFrom = history[moves][0];
        let moveTo = history[moves][1];
        if(y === 0){
          if(moveFrom[1][1].piece && moveTo[3][1]){
            availableSpaces.push([2, y + 1])
            availableSpaces.passants.push([2, y + 1])
          }
        }else if(y === 7){
          if(moveFrom[1][6].piece && moveTo[3][6]){
            availableSpaces.passants.push([2, y - 1])
          }
        }else{
          if(moveFrom[1][y + 1].piece && moveTo[3][y + 1].piece){
            availableSpaces.passants.push([2, y + 1])
          }
          if(moveFrom[1][y - 1].piece && moveTo[3][y - 1].piece){
            availableSpaces.passants.push([2, y - 1])
          }    
        }
      }
    }
    // normal forward directions
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