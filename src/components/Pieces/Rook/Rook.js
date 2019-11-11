import Piece from '../Piece';
import images from '../piece-images';



export default class Rook extends Piece {
  constructor(player){
    super(player, (player === 'ONE' ? images.rook.white : images.rook.black))
  }
}