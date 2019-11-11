import Piece from '../Piece';
import images from '../piece-images';

export default class Queen extends Piece {
  constructor(player){
    super(player, (player === 'ONE' ? images.queen.white : images.queen.black))
  }
}