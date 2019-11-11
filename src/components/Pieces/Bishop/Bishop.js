import Piece from '../Piece';
import images from '../piece-images';

export default class Bishop extends Piece {
  constructor(player){
    super(player, (player === 'ONE' ? images.bishop.white : images.bishop.black))
  }
}