import Piece from '../Piece';
import images from '../piece-images';

export default class Bishop extends Piece {
  constructor(player, x, y){
    super(player, 3, (player === 'ONE' ? images.bishop.white : images.bishop.black))
    this.x = x;
    this.y = y;
    this.availableSpaces = this.availableSpaces.bind(this)
  }

  availableSpaces(x, y, board, player){
    let availableSpaces = [];
    // go up -> right
    let row = x - 1;
    let col = y + 1;
    while(this.isValidTile(row, col)){
      if(!board[row][col].piece){
        availableSpaces.push([row,col])
      }else if(board[row][col].piece.player !== player){
        availableSpaces.push([row,col])
        break;
      }else{
        break;
      }
      row--;
      col++;
    }
    // go up -> left
    row = x - 1;
    col = y - 1
    while(this.isValidTile(row, col)){
      if(!board[row][col].piece){
        availableSpaces.push([row,col])
      }else if(board[row][col].piece.player !== player){
        availableSpaces.push([row,col])
        break;
      }else{
        break;
      }
      row--;
      col--;
    }
    // go down -> right
    row = x + 1;
    col = y + 1;
    while(this.isValidTile(row, col)){
      if(!board[row][col].piece){
        availableSpaces.push([row,col])
      }else if(board[row][col].piece.player !== player){
        availableSpaces.push([row,col])
        break;
      }else{
        break;
      }
      row++;
      col++;
    }
    // go down -> left
    row = x + 1;
    col = y - 1;
    while(this.isValidTile(row, col)){
      if(!board[row][col].piece){
        availableSpaces.push([row,col])
      }else if(board[row][col].piece.player !== player){
        availableSpaces.push([row,col])
        break;
      }else{
        break;
      }
      row++;
      col--;
    }
    return availableSpaces;
  }

}