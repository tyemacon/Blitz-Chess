import Piece from '../Piece';
import images from '../piece-images';

export default class King extends Piece {
  constructor(player, x, y){
    super(player, (player === 'ONE' ? images.king.white : images.king.black))
    this.x = x;
    this.y = y;
    this.onSelect = this.onSelect.bind(this)
  }

  onSelect() {
    console.log(`clicked ${this.x}${this.selected}`)
  }
}