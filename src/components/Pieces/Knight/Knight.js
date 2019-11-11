import Piece from '../Piece';
import images from '../piece-images';

export default class Knight extends Piece {
  constructor(player, x, y){
    super(player, (player === 'ONE' ? images.knight.white : images.knight.black))
    this.x = x;
    this.y = y;
    this.onSelect = this.onSelect.bind(this)
  }

  onSelect() {
    console.log(`clicked ${this.x}${this.selected}`)
  }
}