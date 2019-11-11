import Piece from '../Piece';
import images from '../piece-images';

export default class Knight extends Piece {
  constructor(player, x, y){
    super(player, (player === 'ONE' ? images.knight.white : images.knight.black))
    this.x = x;
    this.y = y;
    this.availableSpaces = this.availableSpaces.bind(this);
  }

  availableSpaces(x, y, board, player){
    let availableSpaces = [];
    const knightEls = [
      [-2,1], // up2 -> right1
      [-2,-1], // up2 -> left1
      [2, 1], // down2 -> right1
      [2,-1], // down2 -> left1
      [-1,-2], // left2 -> up1
      [1,-2], // left2 -> down1
      [-1,2], // right2 -> up1
      [1,2], // right2 -> down1
    ]
    knightEls.forEach((el) => {
      if(this.isValidTile(x + el[0], y + el[1])){
        if(board[x+el[0]][y+el[1]].piece){
          if(board[x+el[0]][y+el[1]].piece.player !== player){
           availableSpaces.push([x+el[0], y+el[1]])
          }
        }else{
          availableSpaces.push([x+el[0], y+el[1]])
        }
      }
    })

    return availableSpaces;
  }

}