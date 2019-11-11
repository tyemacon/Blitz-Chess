import Piece from '../Piece';
import images from '../piece-images';

export default class Knight extends Piece {
  constructor(player){
    super(player, (player === 'ONE' ? images.knight.white : images.knight.black))
  }
}