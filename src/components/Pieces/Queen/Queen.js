import Piece from '../Piece';
import images from '../piece-images';

export default class Queen extends Piece {
  constructor(player, x, y){
    super(player, 9, (player === 'ONE' ? images.queen.white : images.queen.black))
    this.x = x;
    this.y = y;
    this.availableSpaces = this.availableSpaces.bind(this);
  }

  availableSpaces(x, y, board, player){
    let availableSpaces = [];
    let queenDirs = [[1,0], [-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
    queenDirs.forEach((dir) => {
      let row = x + dir[0];
      let col = y + dir[1];
      while(this.isValidTile(row, col)){
        if(!board[row][col].piece){
          availableSpaces.push([row,col]);
        }else if(board[row][col].piece.player !== player){
          availableSpaces.push([row, col]);
          break;
        }else{
          break;
        }
        row += dir[0];
        col += dir[1];
      }
    })

    return availableSpaces;
  }
}