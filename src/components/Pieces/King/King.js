import Piece from '../Piece';
import images from '../piece-images';

export default class King extends Piece {
  constructor(player, x, y){
    super(player, (player === 'ONE' ? images.king.white : images.king.black))
    this.x = x;
    this.y = y;
    this.availableSpaces = this.availableSpaces.bind(this);
  }

  availableSpaces(x, y, board, player){
    let availableSpaces = [];
    let kingMoves = [[1,0], [-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
    kingMoves.forEach((coord) => {
      if(this.isValidTile(x + coord[0], y + coord[1])){
        if(!board[x + coord[0]][y + coord[1]].piece){
          availableSpaces.push([x + coord[0],y + coord[1]])
        }else{
          if(board[x + coord[0]][y + coord[1]].piece.player !== player){
            availableSpaces.push([x + coord[0],y + coord[1]])
          }
        }
      }
    })
    return availableSpaces;
  }
}