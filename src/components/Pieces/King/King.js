import Piece from '../Piece';
import images from '../piece-images';

export default class King extends Piece {
  constructor(player){
    super(player, (player === 'ONE' ? images.king.white : images.king.black))
  }
}