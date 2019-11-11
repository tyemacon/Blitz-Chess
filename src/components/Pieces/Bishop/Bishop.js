import Piece from '../Piece';
import images from '../piece-images';

export default class Bishop extends Piece {
  constructor(player, x, y){
    super(player, (player === 'ONE' ? images.bishop.white : images.bishop.black))
    this.x = x;
    this.y = y;
    this.onSelect = this.onSelect.bind(this)
  }

  onSelect() {
    console.log(`clicked ${this.x}${this.selected}`)
  }
}