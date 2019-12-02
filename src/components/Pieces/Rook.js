import Piece from './Piece';
import images from './piece-images';

export default class Rook extends Piece {
  constructor(player){
    super(player, 5, (player === 1 ? images.rook.white : images.rook.black))
    this.availableSpaces = this.availableSpaces.bind(this)
  }

  availableSpaces(x, y, board, player){
    let availableSpaces = [];
    // go down
    let row = x + 1;
    let col = y; 
    while(this.isValidTile(row, col)){
      if(!board[row][col].piece){
        availableSpaces.push([row, col])
      }else if(board[row][col].piece.player !== player){
        availableSpaces.push([row,col])
        break;
      }else{
        break;
      }
      row++;
    }
    // go up
    row = x - 1;
    while(this.isValidTile(row, col)){
      if(!board[row][col].piece){
        availableSpaces.push([row, col])
      }else if(board[row][col].piece.player !== player){
        availableSpaces.push([row,col])
        break;
      }else{
        break;
      }
      row--;
    }
    // go right
    row = x;
    col = y + 1;
    while(this.isValidTile(row, col)){
      if(!board[row][col].piece){
        availableSpaces.push([row, col])
      }else if(board[row][col].piece.player !== player){
        availableSpaces.push([row,col])
        break;
      }else{
        break;
      }
      col++;
    }
    // go left
    col = y - 1;
    while(this.isValidTile(row, col)){
      if(!board[row][col].piece){
        availableSpaces.push([row, col])
      }else if(board[row][col].piece.player !== player){
        availableSpaces.push([row,col])
        break;
      }else{
        break;
      }
      col--;
    }
    return availableSpaces;
  }

}